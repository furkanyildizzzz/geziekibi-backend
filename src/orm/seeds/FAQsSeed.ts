import { FAQ } from 'orm/entities/faq/FAQ';
import { DataSource } from 'typeorm';

const seedFAQs = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(FAQ);

  const faqs = [
    {
      Order: 1,
      Question: 'Kültür Turları iptal koşulları nelerdir?',
      Answer:
        'Kültür turlarımızda, tur hareket tarihine 30 gün kalaya kadar koşulsuz iptal hakkınız bulunmaktadır. 30-21 gün arasında %50 kesintili, 21 gün altında ise %100 kesintili iptal işlemi yapılabilmektedir.',
    },
    {
      Order: 2,
      Question: 'Kültür turlarında bilgilendirmeler nasıl yapılmaktadır?',
      Answer:
        'Tur bilgilendirmelerimiz turun kalkışına 24 saat kala seyahat danışmanlarımız tarafından sizlere telefon veya e-posta ile iletilmektedir.',
    },
    {
      Order: 3,
      Question: 'Kültür turu aldım hareket noktasında ne zaman bulunmalıyım?',
      Answer:
        'Satın almış olduğunuz tura ilişkin herhangi bir değişiklik olmaması durumunda turun kalkışından 15 dakika önce bekleme alanında bulunulması yeterlidir.',
    },
    {
      Order: 4,
      Question: 'Kültür turu aldım rehberiniz beni arayacak mı?',
      Answer: 'Rehberlerimiz tur kalkış tarihinden önce misafirlerimizi arayarak bilgilendirmektedir.',
    },
    {
      Order: 5,
      Question: 'Grup olarak kültür turu yapmak istiyorum, rezervasyon talebimi nasıl iletebilirim?',
      Answer:
        'Gruplara özel kapalı turlar düzenleyebiliyoruz. Destek alabilmek adına kultur@jollytur.com mail adresine taleplerinizi iletebilirsiniz.',
    },
    {
      Order: 6,
      Question: 'Kültür turuna bölgeden katılmak istiyorum bilet ücretimi tur ücretinden düşebilir miyiz?',
      Answer:
        'Tur bölgesinden tura katılım sağlamak için seyahat danışmanlarımızla görüşme sağlayabilirsiniz. Ayrıntılı bilgi almak adına 444 0 644 numaramızdan seyahat danışmanlarımız sizlere destek sunmaktan mutluluk duyacaklardır.',
    },
    {
      Order: 7,
      Question:
        'Otobüslü aldığım kültür turunda koltuk seçimi veya yer seçimi yapabiliyor muyum? Neye göre koltuklarımız belirleniyor?',
      Answer:
        'Rezervasyon tarihine göre koltuk yerleşimleri otomatik olarak gerçekleşmektedir. Ancak özel taleplerinizi web sitesi veya mobil uygulama üzerinden gerçekleştireceğiniz rezervasyonlarda rezervasyon notu bölümüne yazarak ya da seyahat danışmanlarımıza bilgi vererek iletebilirsiniz.',
    },
    {
      Order: 8,
      Question: 'Müze Kart ücreti fiyatlara dahil midir?',
      Answer:
        'Müze kart fiyatları tur ücretine dahil değildir. Müze kartı inceleyebilmek adına <a target="_blank" href="https://muze.gov.tr/">https://muze.gov.tr/</a> web sitesini ziyaret edebilirsiniz.',
    },
    {
      Order: 9,
      Question:
        'Kültür turunda öğle yemekleri için anlaşmalı olduğunuz noktalarda yemek zorunda mıyız? Gruptan ayrılıp yemek yiyebilir miyiz?',
      Answer: 'Hiçbir zorunluluk bulunmamaktadır. Anlaşmalı noktalarımız öneri niteliğindedir.',
    },
    {
      Order: 10,
      Question: 'Kültür turu fiyatlarınıza her şey dahil midir?',
      Answer:
        'Paket tur içeriği tur özelinde değişmektedir. Tercih ettiğiniz paket tur programını ücrete dahil olan ve ücrete dahil olmayanlarda detaylı olarak iletilmektedir. Dilerseniz tur programlarımızı inceleyebilir ya da seyahat danışmanlarımızdan bilgi alabilirsiniz.',
    },
    {
      Order: 11,
      Question: 'Sıralı uçuş nedir?',
      Answer:
        'Tur uçuş biletleri gidiş-dönüş birlikte kesilmektedir. Ayrı bilet olarak değerlendirilemez. Gidiş uçuşu kullanılmayan durumlarda diğer uçuş bacakları havayolu sistemleri kuralı gereği kullanılmaz hale gelmektedir ve iptal edilmektedir. Ayrıntılı bilgi için 444 0 644 numaralı çağrı merkezimizle iletişime geçebilirsiniz.',
    },
    {
      Order: 12,
      Question: 'Özel taleplerimi nasıl iletebilirim?',
      Answer:
        'Özel taleplerinizi web sitemiz ve mobil uygulamamız üzerinden gerçekleştireceğiniz rezervasyon sırasında rezervasyon notları bölümüne, çağrı merkezi ya da acentelerimizden gerçekleştireceğiniz rezervasyonlarınızda seyahat danışmanlarımıza iletmeniz yeterli olacaktır. Ayrıca katılmış olduğunuz tur sırasında talepleriniz olması durumunda tur rehberinize taleplerinizi iletebilirsiniz. Tur rehberimiz uygunluğa göre sizlere yardımcı olmaktan mutluluk duyacaktır.',
    },
    {
      Order: 13,
      Question: 'Yurtiçi turlarda 18 yaş altındaki misafirler için muvafakatname zorunluluğu bulunmakta mıdır?',
      Answer:
        '18 yaş altındaki misafirlerimiz ebeveyni olmadan veya ebeveynlerinden yalnız biri ile seyahat edecekse muvafakatname talep edilecektir. Yasal vasilerden noter onaylı muvafakatname alınmadığı durumlarda seyahate kabul edilmeyebilir.',
    },
  ];

  for (const item of faqs) {
    let faq = new FAQ();
    faq.Order = item.Order;
    faq.Question = item.Question;
    faq.Answer = item.Answer;
    faq.insertUserId = 1;
    await repo.save(faq);
  }

  console.log('All FAQs have been seeded!');
};

export default seedFAQs;
