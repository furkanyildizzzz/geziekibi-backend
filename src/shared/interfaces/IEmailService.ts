import { EmailTemplateEnum } from 'shared/utils/enum';

export interface IEmailService {
  /**
   * 📩 Email gönder
   * @param to Alıcı email adresi
   * @param template Email şablonu anahtarı (USER_WELCOME, PASSWORD_RESET vs.)
   * @param variables Şablon içinde değiştirilecek dinamik veriler
   */
  sendEmail(to: string, template: EmailTemplateEnum, variables: Record<string, string>): Promise<void>;

  /**
   * 📩 Tüm email şablonlarını getir
   */
  getAllTemplates(): Promise<{ key: EmailTemplateEnum; subject: string; body: string }[]>;

  /**
   * 📩 Belirli bir email şablonunu getir
   * @param key Email şablonu anahtarı
   */
  getTemplateByKey(key: EmailTemplateEnum): Promise<{ key: EmailTemplateEnum; subject: string; body: string }>;

  /**
   * 📩 Email şablonunu güncelle
   * @param key Email şablonu anahtarı
   * @param subject Yeni email başlığı
   * @param body Yeni email içeriği (HTML destekler)
   */
  updateTemplate(key: EmailTemplateEnum, subject: string, body: string): Promise<void>;

  uploadBodyImage(files: Express.Multer.File): Promise<string>;
}
