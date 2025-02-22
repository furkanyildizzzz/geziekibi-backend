import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Service } from 'orm/entities/service/Service';
import { TourCategory } from 'orm/entities/tour/TourCategory';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { DataSource } from 'typeorm';

const seedTourServices = async (dataSource: DataSource) => {
  const serviceRepository = dataSource.getRepository(Service);

  const includedServices = [
    'Lüks turizm aracı ile ulaşım',
    '1 gece konaklama',
    'Rehberlik hizmetleri',
    'Otelde sabah kahvaltısı',
    'Otelde akşam yemeği',
    'Zorunlu seyahat sigortası',
    'Müze ören yeri girişleri',
    'İlk varıştaki sabah kahvaltısı',
    'Tur boyunca profesyonel rehberlik hizmeti',
    'Tekne turu ücreti',
    'Hoş geldiniz kokteyli',
    'Otelde açık büfe sabah kahvaltısı',
    'Gece turları',
    'Kamp alanında çadır ve uyku tulumu',
  ];

  for (const serviceName of includedServices) {
    const service = new Service();
    service.name = serviceName;
    service.insertUserId = 1;
    await serviceRepository.save(service);
  }

  const excludedServices = [
    'Yemeklerde alınan içecekler',
    'Yolda ve molalarda alınan yemekler',
    'Fayton ücretleri',
    'Kişisel harcamalar',
    'Yurtdışı çıkış harcı',
    'Ekstra program aktiviteleri',
    'Teleferik ücretleri',
    'Rafting, kano gibi macera sporları',
    'Müze ve ören yerleri giriş ücretleri',
    'Otelde minibar kullanımı',
    'Havaalanı ve liman vergileri',
    'Fotoğraf ve video çekim ücretleri',
  ];

  for (const serviceName of excludedServices) {
    const service = new Service();
    service.name = serviceName;
    service.insertUserId = 1;
    await serviceRepository.save(service);
  }

  console.log('All tour services have been seeded!');
};

export default seedTourServices;
