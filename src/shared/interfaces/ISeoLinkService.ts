export interface ISeoLinkService {
  generateSeoLink(str: string): Promise<string>;
  generateUniqueSeoLink(str: string, repo: string, id: number): Promise<string>;
}
