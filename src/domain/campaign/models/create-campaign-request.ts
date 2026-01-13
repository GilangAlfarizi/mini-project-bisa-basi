export class CreateCampaignRequest {
  categoryId: string;
  name: string;
  description: string;
  file: Express.Multer.File;
}
