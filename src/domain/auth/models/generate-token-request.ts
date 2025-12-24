type GenerateTokenOptions = {
  expiresIn?: string;
  secret?: string;
};

export class GenerateTokenRequest {
  payload: any;
  options?: GenerateTokenOptions;
}
