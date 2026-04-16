import { ITfFormRepository } from '@domain/tf-form';
import { ITfResponseRepository } from '@domain/tf-responses';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WebhookTypeformUseCase {
  private readonly logger = new Logger(WebhookTypeformUseCase.name);

  constructor(
    private readonly tfFormRepository: ITfFormRepository,
    private readonly tfResponseRepository: ITfResponseRepository,
  ) {}

  async execute(payload: any): Promise<void> {
    // Typeform sends slightly different shapes depending on webhook configuration.
    // We keep parsing defensive so the webhook won't crash on unexpected payloads.
    const formResponse =
      payload?.form_response ??
      payload?.formResponse ??
      payload?.data?.form_response ??
      payload?.data?.formResponse;

    if (!formResponse) {
      this.logger.warn(
        'Typeform webhook received without form_response payload',
      );
      return;
    }

    const formId: string | undefined =
      formResponse?.form_id ??
      formResponse?.formId ??
      payload?.form_id ??
      payload?.formId;

    const token: string | undefined = formResponse?.token ?? payload?.token;

    // Choose a deterministic id to satisfy `tf_responses.id` primary key.
    // Fallback to `${formId}:${token}` if Typeform doesn't send an explicit response id.
    const responseId: string | undefined =
      formResponse?.id ??
      formResponse?.form_response_id ??
      payload?.form_response_id ??
      payload?.id ??
      payload?.event_id ??
      (formId && token ? `${formId}:${token}` : undefined);

    if (!formId || !token || !responseId) {
      this.logger.warn(
        `Typeform webhook missing required fields (formId=${formId ?? 'nil'}, token=${token ?? 'nil'}, responseId=${responseId ?? 'nil'})`,
      );
      return;
    }

    // Ensure the form exists (optional but makes relation consistent).
    const existingForm = await this.tfFormRepository.findOne({
      select: { id: true },
      where: { id: formId },
    });

    if (!existingForm) {
      await this.tfFormRepository.create({
        data: {
          id: formId,
          title: formResponse?.form_title ?? payload?.form_title ?? '',
          syncedAt: new Date().toISOString(),
          // Store the raw payload as JSON for future use.
          data: payload,
        } as any,
      });
    }

    // Idempotency: Typeform can retry webhooks; avoid inserting duplicates.
    const existingResponse = await this.tfResponseRepository.findOne({
      select: { id: true },
      where: { token },
    });

    if (existingResponse) return;

    await this.tfResponseRepository.create({
      data: {
        id: responseId,
        formId,
        token,
        syncedAt: new Date().toISOString(),

        submittedAt: formResponse?.submitted_at ?? formResponse?.submittedAt,
        landedAt: formResponse?.landed_at ?? formResponse?.landedAt,

        landingId: formResponse?.landing_id ?? formResponse?.landingId,
        responseType: formResponse?.response_type ?? formResponse?.responseType,

        // Persist the received webhook request for later debugging/auditing.
        // We also keep Typeform's `form_response.metadata` separately.
        metadata: {
          request: payload,
          formResponseMetadata: formResponse?.metadata,
        },
        hidden: formResponse?.hidden,
        calculated: formResponse?.calculated,
        variables: formResponse?.variables,
        outcome: formResponse?.outcome,
        answers: formResponse?.answers,
        thankyouScreenRef:
          formResponse?.thankyou_screen_ref ?? formResponse?.thankyouScreenRef,
      } as any,
    });
  }
}
