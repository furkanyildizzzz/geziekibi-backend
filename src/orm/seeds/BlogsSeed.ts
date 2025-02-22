import { Blog } from 'orm/entities/blog/Blog';
import { BlogCategory } from 'orm/entities/blog/BlogCategory';
import { Image } from 'orm/entities/image/Image';
import { Tag } from 'orm/entities/tag/Tag';
import { TourDailyPath } from 'orm/entities/tour/TourDailyPath';
import { PublishStatus } from 'shared/utils/enum';
import { generateUniqueSeoLink } from 'shared/utils/generateSeoLink';
import { DataSource } from 'typeorm';

const seedBlogs = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Blog);

  let blog = new Blog();
  blog.title = 'Bursa’nın Gezilecek Yerleri: Yeşilin ve Tarihin Buluştuğu Şehir';
  blog.seoLink = await generateUniqueSeoLink(blog.title, 'blog');
  blog.spot = '';
  blog.publishStatus = PublishStatus.PUBLISH;
  blog.publishDate = new Date();
  blog.category = { id: 1 } as BlogCategory;
  blog.tags = [{ id: 1 }] as Tag[];
  blog.insertUserId = 1;

  blog.body = `<h2><strong>Osmanlı İzleriyle Bursa Gezisi</strong></h2>
<p>Bursa, Osmanlı İmparatorluğu’nun ilk başkenti olarak tarihe geçmiş, bu unvanıyla birçok önemli esere ev sahipliği yapmıştır.<em> Her bir köşesinde Osmanlı’nın ihtişamını hissedebileceğiniz</em> bu şehir, tarih tutkunları için âdeta bir cennettir. Bu bölgede konumlanan <a href="https://www.jollytur.com/yurtici-oteller">yurt içi otelleri</a>nde konaklarken geçmişte bir yolculuğa çıkmak için görebileceğimiz lokasyonlar şöyle sıralanabilir:</p>
<figure class="wp-block-image size-large"><img loading="lazy" width="720" height="540" src="https://blog.jollytur.com/wp-content/uploads/2014/12/IMG_243942279852803.jpeg" alt="" class="wp-image-2577" srcset="https://blog.jollytur.com/wp-content/uploads/2014/12/IMG_243942279852803.jpeg 720w, https://blog.jollytur.com/wp-content/uploads/2014/12/IMG_243942279852803-300x225.jpeg 300w" sizes="(max-width: 720px) 100vw, 720px"></figure>
<h3>Koza Han: Tarihî Dokusuyla Büyüleyen Çarşı</h3>
<p>Bursa merkezde gezilecek yerler denince akla ilk gelen destinasyonlardan biri olan Koza Han, <strong>kentin tarihî ve kültürel mirasının en önemli simgelerinden</strong> biridir. Osmanlı döneminde ipek ticaretinin merkezi olarak kullanılan bu yapı, günümüzde hâlâ canlılığını koruyarak ziyaretçilerini büyülemeye devam eder. Koza Han’ın içindeki çarşı, el işi ürünler ve geleneksel Bursa hediyelikleri ile doludur.</p>
<figure class="wp-block-image size-large"><img loading="lazy" width="1000" height="665" src="https://blog.jollytur.com/wp-content/uploads/2016/01/Bursa-Koza-Han-1.jpg" alt="Bursa" class="wp-image-22505" srcset="https://blog.jollytur.com/wp-content/uploads/2016/01/Bursa-Koza-Han-1.jpg 1000w, https://blog.jollytur.com/wp-content/uploads/2016/01/Bursa-Koza-Han-1-300x200.jpg 300w, https://blog.jollytur.com/wp-content/uploads/2016/01/Bursa-Koza-Han-1-768x511.jpg 768w" sizes="(max-width: 1000px) 100vw, 1000px"></figure>
<h3>Ulu Camii: Mimari İhtişamın Başyapıtı</h3>
<p>Bursa’nın simgelerinden biri olan Ulu Camii, Osmanlı mimarisinin en önemli eserleri arasında yer alır. 14. yüzyılda inşa edilen yapı, zarif minaresi ve muhteşem kubbesiyle dikkat çeker. İç mekânındaki süslemeler ve detaylar da mimari ihtişamın bir yansımasıdır. Ulu Camii hem ibadet mekânı olarak kullanılan hem de ziyaretçilere açık olan bir kültür ve tarih hazinesidir. Bursa’da gezilecek yerleri ziyaret eden herkesin mutlaka görmesi gereken bu başyapıt,<em> şehrin tarihî ve manevi derinliğini vurgular.</em></p>
<figure class="wp-block-image size-large is-resized"><img loading="lazy" src="https://blog.jollytur.com/wp-content/uploads/2014/11/ulucami_31.jpg" alt="" class="wp-image-940" width="559" height="421" srcset="https://blog.jollytur.com/wp-content/uploads/2014/11/ulucami_31.jpg 400w, https://blog.jollytur.com/wp-content/uploads/2014/11/ulucami_31-300x225.jpg 300w" sizes="(max-width: 559px) 100vw, 559px"></figure>
<h3>Cumalıkızık Köyü: Osmanlı’nın Yaşayan Hazinesi</h3>
<p>Bursa’da gezilecek yerlerden biri diğeri Cumalıkızık Köyü, Osmanlı döneminden günümüze ulaşan orijinal ahşap evleriyle ünlüdür. Geleneksel Osmanlı mimarisini yansıtan detaylarla dolu olan bu şirin evler, köyün tarihini günümüze taşır. Bölgedeki her bir yapı, o dönemin yaşam tarzını ve kültürünü yansıtan birer anıt gibidir.</p>
<figure class="wp-block-image size-large"><img loading="lazy" width="940" height="788" src="https://blog.jollytur.com/wp-content/uploads/2016/01/Bursa-Cumalıkızık-Köyü-1.png" alt="Bursa" class="wp-image-22500" srcset="https://blog.jollytur.com/wp-content/uploads/2016/01/Bursa-Cumalıkızık-Köyü-1.png 940w, https://blog.jollytur.com/wp-content/uploads/2016/01/Bursa-Cumalıkızık-Köyü-1-300x251.png 300w, https://blog.jollytur.com/wp-content/uploads/2016/01/Bursa-Cumalıkızık-Köyü-1-768x644.png 768w" sizes="(max-width: 940px) 100vw, 940px"></figure>
<h3>Tophane Meydanı: Şehrin Nostaljik Kalbi</h3>
<p>Tophane Meydanı, tarihî çınar ağaçları ve Osmanlı döneminden kalma binalarla çevrilidir. Burada yürürken şehrin geçmişine ait izlerle karşılaşmak, böylece âdeta zamanın içinde yolculuk yapmak işten bile değildir. Üstelik meydanın etrafında yer alan kafeler ve dükkânlar, şehrin karakteristik atmosferini yansıtırken ziyaretçilere dinlenme ve alışveriş yapma imkânı da sunar.</p>
<p>Meydanın merkezinde bulunan Tophane Saat Kulesi, şehrin simgelerindendir ve Bursa’da gezilecek yerlerden biridir. Osmanlı mimarisinin zarif bir örneği olan bu saat kulesi, şehrin siluetini de tamamlayan detaylardandır.</p>
<figure class="wp-block-image size-large"><img loading="lazy" width="1024" height="683" src="https://blog.jollytur.com/wp-content/uploads/2024/05/osmangazi-ve-orhangazi-turbeleri-1024x683_large_large.jpg" alt="" class="wp-image-27906" srcset="https://blog.jollytur.com/wp-content/uploads/2024/05/osmangazi-ve-orhangazi-turbeleri-1024x683_large_large.jpg 1024w, https://blog.jollytur.com/wp-content/uploads/2024/05/osmangazi-ve-orhangazi-turbeleri-1024x683_large_large-300x200.jpg 300w, https://blog.jollytur.com/wp-content/uploads/2024/05/osmangazi-ve-orhangazi-turbeleri-1024x683_large_large-768x512.jpg 768w, https://blog.jollytur.com/wp-content/uploads/2024/05/osmangazi-ve-orhangazi-turbeleri-1024x683_large_large-90x60.jpg 90w" sizes="(max-width: 1024px) 100vw, 1024px"></figure>
<h3>Osman Gazi Türbesi: Maneviyat Dolu Atmosfer</h3>
<p>Osman Gazi Türbesi, Bursa’nın merkezinde yer alan tarihi bir yapıdır. Türbenin dış cephesi, Osmanlı mimarisinin zarif ve ihtişamlı bir örneğidir. İç mekânında ise Osman Gazi’nin sandukası ve çevresindeki süslemeler bulunur. Bu türbeye adım attığınızda tarihin derinliklerine doğru bir yolculuğa çıkar ve Osmanlı İmparatorluğu’nun ilk günlerine tanıklık edersiniz. Türbenin sessizliği ve huzuru, ziyaretçilere içsel bir dinginlik verir. Türbenin çevresinde bulunan bahçe ve çeşmeler de ziyaretçiler için dinlenme ve meditasyon alanları sunar.</p>
<figure class="wp-block-image size-large"><img loading="lazy" width="550" height="412" src="https://blog.jollytur.com/wp-content/uploads/2015/10/9b5baba02efcee976a5fd97adb9b5dff.jpg" alt="" class="wp-image-8726" srcset="https://blog.jollytur.com/wp-content/uploads/2015/10/9b5baba02efcee976a5fd97adb9b5dff.jpg 550w, https://blog.jollytur.com/wp-content/uploads/2015/10/9b5baba02efcee976a5fd97adb9b5dff-300x225.jpg 300w" sizes="(max-width: 550px) 100vw, 550px"></figure>
<h2><strong>Uludağ: Kayak Tutkunlarının Cenneti</strong></h2>
<p>Bursa’nın simgelerinden Uludağ, yılın büyük bir kısmında beyaz bir örtüyle kaplıdır. Hâl böyle olunca bu büyüleyici bölge, Türkiye’nin en popüler kayak merkezlerinden biri olarak her yıl binlerce kişiye ev sahipliği yapar. Yüzlerce kilometrelik pistleri, her seviyeden kayakçıya hitap eder ve her tür kayak ve snowboard deneyimi için mükemmel koşullar sunar.</p>
<p>Uludağ Millî Parkı ise sadece kayak tutkunlarının değil, doğa ve maceraseverlerin de vazgeçilmez destinasyonlarından biridir. Her mevsim farklı bir güzellik sunan bu eşsiz bölge, <a href="https://www.jollytur.com/bursa-otelleri">Bursa otelleri</a>nde konaklayan ziyaretçilerine unutulmaz bir deneyim ve huzur dolu anlar yaşatır.</p>
<figure class="wp-block-image size-large"><img loading="lazy" width="1024" height="671" src="https://blog.jollytur.com/wp-content/uploads/2015/01/9498_20120223A2302054_04_201202240918-1024x671.jpg" alt="" class="wp-image-4097" srcset="https://blog.jollytur.com/wp-content/uploads/2015/01/9498_20120223A2302054_04_201202240918-1024x671.jpg 1024w, https://blog.jollytur.com/wp-content/uploads/2015/01/9498_20120223A2302054_04_201202240918-300x197.jpg 300w" sizes="(max-width: 1024px) 100vw, 1024px"></figure>
<h2><strong>Bursa Arkeoloji Müzesi: Geçmişe Açılan Kapı</strong></h2>
<p>Bursa Arkeoloji Müzesi, <em>şehrin tarihine ve kültürel mirasına ışık tutan</em> önemli bir merkezdir. Ziyaretçileri geçmişe doğru heyecan verici bir yolculuğa çıkaran bu müze, birçok döneme ait tarihî eserleri bünyesinde barındırır; osmanlı, Antik Roma, Bizans dönemine ait kalıntılara ev sahipliği yapar.</p>
<figure class="wp-block-image size-large"><img loading="lazy" width="1024" height="680" src="https://blog.jollytur.com/wp-content/uploads/2024/05/07012013_c8fdf153-72ef-4334-bcea-1a49546d2481-1024x680.jpg" alt="" class="wp-image-27907" srcset="https://blog.jollytur.com/wp-content/uploads/2024/05/07012013_c8fdf153-72ef-4334-bcea-1a49546d2481-1024x680.jpg 1024w, https://blog.jollytur.com/wp-content/uploads/2024/05/07012013_c8fdf153-72ef-4334-bcea-1a49546d2481-300x199.jpg 300w, https://blog.jollytur.com/wp-content/uploads/2024/05/07012013_c8fdf153-72ef-4334-bcea-1a49546d2481-768x510.jpg 768w, https://blog.jollytur.com/wp-content/uploads/2024/05/07012013_c8fdf153-72ef-4334-bcea-1a49546d2481-1536x1020.jpg 1536w, https://blog.jollytur.com/wp-content/uploads/2024/05/07012013_c8fdf153-72ef-4334-bcea-1a49546d2481-90x60.jpg 90w, https://blog.jollytur.com/wp-content/uploads/2024/05/07012013_c8fdf153-72ef-4334-bcea-1a49546d2481.jpg 1600w" sizes="(max-width: 1024px) 100vw, 1024px"></figure>
<h2><strong>Mudanya, Trilye ve İznik: Mavi Manzaralar Eşliğinde Tarihî Keşifler</strong></h2>
<p>Mudanya, Bursa’nın deniz kenarındaki incisi olarak bilinir. Eşsiz sahil şeridi ve limanıyla Mudanya gezilecek yerleri ile ziyaretçilere huzur dolu mola noktaları sunar. Bölgenin tarihi dokusunu yansıtan eski Rum evleri ve dar sokakları, geçmişe doğru keyifli bir yolculuk yapmanızı sağlar.</p>
<p>Trilye ise Bursa’da gezilecek yerler arasında tarihî ve doğal güzelliklerle süslenmiş bir diğer bölgedir. Eski Rum yerleşim yerleri, taş evleri ve dar sokaklarıyla Trilye’de gezilecek yerler, âdeta bir açık hava müzesini andırır. Burada dolaşırken tarihi kiliseleri, çeşmeleri ve hamamları keşfedebilir ve şehrin atmosferinin tadını çıkarabilirsiniz.</p>
<p>Bursa’da gezilecek yerler arasında popüler bir seçenek olan İznik, Roma ve Bizans dönemlerine ait birçok tarihi esere ev sahipliği yapar. Özellikle İznik gezilecek yerlerinden biri olan büyüleyici gölün etrafında yer alan tarihi surlar ve yapılar, ziyaretçilere benzersiz bir atmosfer sunar.</p>
<figure class="wp-block-image size-large"><img loading="lazy" width="1000" height="629" src="https://blog.jollytur.com/wp-content/uploads/2016/01/mudanya-1.jpg" alt="Bursa" class="wp-image-22504" srcset="https://blog.jollytur.com/wp-content/uploads/2016/01/mudanya-1.jpg 1000w, https://blog.jollytur.com/wp-content/uploads/2016/01/mudanya-1-300x189.jpg 300w, https://blog.jollytur.com/wp-content/uploads/2016/01/mudanya-1-768x483.jpg 768w" sizes="(max-width: 1000px) 100vw, 1000px"></figure>
<h2><strong>Bursa Kaplıcaları: Doğal Şifa ve Huzur Kaynakları</strong></h2>
<p>Bursa kaplıcaları, çeşitli hastalıklara ve rahatsızlıklara şifa kaynağı olarak görülür. Romatizma, eklem ağrıları, cilt hastalıkları, sinirsel rahatsızlıklar ve solunum yolları problemleri gibi birçok sağlık sorununa iyi geldiği bilinir. Siz de Bursa gezilecek yerler doğal şifası ile yenilenmenizi sağlasın istiyorsanız kaplıcalar sizin için doğru adres olabilir. <a href="https://www.jollytur.com/bursa-termal-oteller">Bursa termal oteller</a>; masaj, cilt bakımı ve diğer spa uygulamaları ile ziyaretçiler için sağlığın ve huzurun merkezi hâline gelir.</p>
<figure class="wp-block-image size-large"><img loading="lazy" width="1024" height="768" src="https://blog.jollytur.com/wp-content/uploads/2015/04/Mavi-göl-eigen-werk-self-made-1024x768.jpg" alt="" class="wp-image-5222" srcset="https://blog.jollytur.com/wp-content/uploads/2015/04/Mavi-göl-eigen-werk-self-made.jpg 1024w, https://blog.jollytur.com/wp-content/uploads/2015/04/Mavi-göl-eigen-werk-self-made-300x225.jpg 300w, https://blog.jollytur.com/wp-content/uploads/2015/04/Mavi-göl-eigen-werk-self-made-600x450.jpg 600w" sizes="(max-width: 1024px) 100vw, 1024px"><figcaption>Açık alan kaplıcaları düşündüğünüzden çok daha fazla yerde bulunur. | Fotoğraf: Eigen Werk / self made</figcaption></figure>`;
  blog.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733426995/dev/blog/2024-12-05/1/rr497lezpbtlr8q39pbv.jpg',
      format: 'jpg',
      width: 806,
      height: 646,
      publicId: 'dev/blog/2024-12-05/1/rr497lezpbtlr8q39pbv',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733426995/dev/blog/2024-12-05/1/rr497lezpbtlr8q39pbv.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T07:27:26.000Z'),
      originalName: 'bursa-806-646.jpg',
    } as Image,
  ];
  await repo.save(blog);

  blog = new Blog();
  blog.title = 'Wanderlust Chronicles: Unveiling Hidden Havens and Forgotten Pathways';
  blog.seoLink = await generateUniqueSeoLink(blog.title, 'blog');
  blog.spot = `In a world filled with wonders waiting to be discovered, the allure of the road less traveled beckons to the adventurous soul. Join me on a journey beyond the beaten path, where each destination promises unique experiences and unforgettable memories. From hidden paradises to cultural gems, let's embark on an odyssey of exploration and discovery.`;
  blog.publishStatus = PublishStatus.PUBLISH;
  blog.publishDate = new Date();
  blog.category = { id: 1 } as BlogCategory;
  blog.tags = [{ id: 1 }] as Tag[];
  blog.insertUserId = 1;

  blog.body = `<div><div class="box-image-video"> <img src="/assets/imgs/page/blog/img-video.png" alt="Travilla"><a class="btn-play-video popup-youtube"></a><p>In a world filled with wonders waiting to be discovered, the allure of  the road less traveled beckons to the adventurous soul. Join me on a  journey beyond the beaten path, where each destination promises unique  experiences and unforgettable memories. From hidden paradises to  cultural gems, let's embark on an odyssey of exploration and discovery.</p><h6>1. Embracing Serenity in the Scottish Highlands:</h6><p>Our adventure begins amidst the rugged beauty of the Scottish Highlands,  where mist-covered mountains and shimmering lochs create a landscape  straight out of a fairytale. Far from the hustle and bustle of city  life, we'll wander along winding trails, breathing in the crisp Highland  air and immersing ourselves in the tranquility of nature. From the  ancient ruins of castles to the timeless charm of quaint villages, every  corner of this enchanting region holds the promise of adventure.</p><h6>2. Chasing Waterfalls in the Heart of Costa Rica:</h6><p>Next, we'll journey to the lush rainforests of Costa Rica, a land of  unparalleled biodiversity and natural splendor. Here, hidden within the  emerald green canopy, lie some of the world's most breathtaking  waterfalls. We'll trek through dense jungle trails, listening to the  symphony of exotic birdsong and the gentle rush of cascading water as we  discover hidden oases tucked away from the beaten path. With each  plunge into crystal-clear pools beneath thundering falls, we'll find  renewal and connection with the raw power of nature.</p><h6>3. Uncovering Ancient Mysteries in the Temples of Myanmar:</h6><p>Our quest for adventure takes us to the enchanting land of Myanmar,  where ancient temples and pagodas whisper tales of bygone eras. From the  sprawling plains of Bagan to the serene shores of Inle Lake, we'll  journey through a landscape steeped in spirituality and tradition.  Amidst the golden spires and intricate carvings of centuries-old  monuments, we'll uncover the timeless beauty of Burmese culture and the  enduring legacy of a land shrouded in mystery.</p><h6>4. Sailing into the Unknown in the Galápagos Islands:</h6><p>Our voyage of discovery leads us to the remote shores of the Galápagos  Islands, a haven of biodiversity teeming with life found nowhere else on  Earth. Setting sail on azure waters, we'll explore pristine beaches,  volcanic landscapes, and bustling seabird colonies. Snorkeling alongside  graceful sea turtles and playful sea lions, we'll witness the delicate  balance of life in one of the world's most pristine marine ecosystems,  leaving us humbled by the wonders of the natural world.</p><h6>5. Lost in Time: Exploring the Medieval Villages of Transylvania, Romania:</h6><p>Our final destination transports us to the storied land of Transylvania,  where medieval castles and fortified churches dot the landscape like  something out of a Gothic fairy tale. Venturing off the beaten path,  we'll wander through cobblestone streets and labyrinthine alleyways,  immersing ourselves in the rich history and folklore of this captivating  region. From the haunting beauty of Bran Castle to the picturesque  charm of Sighisoara, every corner of Transylvania holds a story waiting  to be discovered.</p></div>
  </div>`;

  blog.primaryImages = [
    {
      url: 'http://res.cloudinary.com/furkannn/image/upload/v1733501282/dev/blog/2024-12-06/2/mopecvl0h0ssjjqrumfo.jpg',
      format: 'jpg',
      width: 806,
      height: 646,
      publicId: 'dev/blog/2024-12-06/2/mopecvl0h0ssjjqrumfo',
      secureUrl:
        'https://res.cloudinary.com/furkannn/image/upload/v1733501282/dev/blog/2024-12-06/2/mopecvl0h0ssjjqrumfo.jpg',
      order: 1,
      createdAt: new Date('2024-12-04T07:27:26.000Z'),
      originalName: 'wanderlust-806-646.jpg',
    } as Image,
  ];
  await repo.save(blog);

  console.log('All blogs have been seeded!');
};

export default seedBlogs;
