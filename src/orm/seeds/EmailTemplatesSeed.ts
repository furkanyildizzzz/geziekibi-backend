import { EmailTemplate } from 'orm/entities/emailTemplate/EmailTemplate';
import { EmailTemplateEnum } from 'shared/utils/enum';
import { DataSource } from 'typeorm';

const seedEmailTemplates = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(EmailTemplate);

  const templates = [
    {
      key: EmailTemplateEnum.USER_WELCOME,
      subject: 'Hoş Geldiniz, {{name}}!',
      body: `<div style="text-align: center;"><img src="https://geziekibi.com/logo.jpg" width="150" alt="Gezi Ekibi"></div><p>Merhaba {{name}}, Gezi Ekibi'ne hoş geldiniz! <br> Yeni tur fırsatlarını keşfetmek için <a href='{{link}}'>buraya</a> tıklayın.</p>`,
    },
    {
      key: EmailTemplateEnum.ADMIN_NEW_USER,
      subject: 'Yeni Kullanıcı Kayıt Oldu: {{name}}',
      body: `<div style="text-align: center;"><img src="https://geziekibi.com/logo.jpg" width="150" alt="Gezi Ekibi"></div><p>Merhaba Admin,<br> Yeni bir kullanıcı kayıt oldu: <b>{{name}}</b> ({{email}}).</p>`,
    },
    {
      key: EmailTemplateEnum.USER_TOUR_REGISTRATION,
      subject: 'Tur Kaydınız Onaylandı: {{tour_name}}',
      body: `<div style="text-align: center;"><img src="https://geziekibi.com/logo.jpg" width="150" alt="Gezi Ekibi"></div><p>Merhaba {{name}}, <br> '{{tour_name}}' turuna kaydınız onaylandı! <br> Detaylar için <a href='{{tour_link}}'>buraya</a> tıklayın.</p>`,
    },
    {
      key: EmailTemplateEnum.ADMIN_TOUR_NOTIFICATION,
      subject: 'Yeni Tur Kaydı: {{name}} - {{tour_name}}',
      body: `<div style="text-align: center;"><img src="https://geziekibi.com/logo.jpg" width="150" alt="Gezi Ekibi"></div><p>Merhaba Admin,<br> Kullanıcı <b>{{name}}</b> '{{tour_name}}' turuna kayıt oldu.</p>`,
    },
    {
      key: EmailTemplateEnum.USER_CONTACT_FORM,
      subject: 'Mesajınız Alındı, {{name}}',
      body: `<div style="text-align: center;"><img src="https://geziekibi.com/logo.jpg" width="150" alt="Gezi Ekibi"></div><p>Merhaba {{name}},<br> Mesajınızı aldık, en kısa sürede dönüş yapacağız! <br> Gönderdiğiniz mesaj: <b>{{message}}</b></p>`,
    },
    {
      key: EmailTemplateEnum.ADMIN_CONTACT_NOTIFICATION,
      subject: 'Yeni İletişim Formu Gönderildi',
      body: `<div style="text-align: center;"><img src="https://geziekibi.com/logo.jpg" width="150" alt="Gezi Ekibi"></div><p>Merhaba Admin,<br> Kullanıcı <b>{{name}}</b> bir mesaj gönderdi:<br> <b>{{message}}</b></p>`,
    },
  ];

  for (const templateData of templates) {
    let template = new EmailTemplate();
    template.key = templateData.key;
    template.subject = templateData.subject;
    template.body = templateData.body;
    template.insertUserId = 1;
    await repo.save(template);
  }

  console.log('All email templates have been seeded!');
};

export default seedEmailTemplates;
