export class CreateCampaignRequest {
  categoryId: string;
  name: string;
  description: string;
  thumbnail: Express.Multer.File;
}
