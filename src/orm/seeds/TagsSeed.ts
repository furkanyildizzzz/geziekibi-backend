import { Tag } from 'orm/entities/tag/Tag';
import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { DataSource } from 'typeorm';

const seedTags = async (dataSource: DataSource) => {
  const tagRepository = dataSource.getRepository(Tag);

  const tags = [
    'Seyahat',
    'Yurtiçi Turlar',
    'Yurtdışı Turlar',
    'Kültür Turları',
    'Doğa Gezileri',
    'Balayı Turları',
    'Uygun Fiyatlı Turlar',
    'Hafta Sonu Kaçamağı',
    'Macera Turları',
    'Yemek Turları',
    'Sanat ve Tarih',
    'Kış Tatili',
    'Yaz Tatili',
    'Kayak Turları',
    'Vizesiz Turlar',
    'Ekonomik Tatil',
    'Aile Turları',
    'Kişiye Özel Turlar',
    'Fotoğrafçılık Gezileri',
    'Şehir Turları',
    'Tekne Turları',
    'Festival Turları',
    'Kamp Turları',
    'Deniz Tatili',
    'Ege Turları',
    'Karadeniz Turları',
    'Kapadokya Turları',
    'Gurme Turları',
    'Doğa Yürüyüşleri',
    'Köy Turları',
    'Efsaneler ve Mitoloji',
    'Spa ve Wellness',
    'Lüks Turlar',
    'Antik Kentler',
    'Ekstrem Sporlar',
    'Bisiklet Turları',
    'İzole Tatiller',
    'Vahşi Yaşam',
    'Tarih ve Kültür',
    'Günübirlik Turlar',
    'Kültürel Etkinlikler',
    'Avrupa Turları',
    'Asya Turları',
    'Gemi Turları',
    'Romantik Tatiller',
    'Huzurlu Kaçamaklar',
    'Kış Sporları',
    'Plaj Tatili',
    'Doğu Anadolu Turları',
    'Güneydoğu Anadolu Turları',
    'Tarihi Yollar',
    'Doğal Güzellikler',
    'Yoga ve Meditasyon',
    'Adrenalin Turları',
    'Yerel Deneyimler',
    'Çocuk Dostu Turlar',
    'Sokak Sanatı',
    'Müzik Festivalleri',
    'Uzak Doğu Turları',
    'Orta Doğu Turları',
    'Sahra Çölü Gezisi',
    'Kuzey Işıkları',
    'Arktik Turları',
    'Doğa Kaşifleri',
    'Hayalinizdeki Tatil',
  ];

  for (const tagName of tags) {
    const tag = new Tag();
    tag.name = tagName;
    await tagRepository.save(tag);
  }

  console.log('All tags have been seeded!');
};

export default seedTags;
