-- =====================================================================
-- Explora El Salvador: datos de ejemplo
-- Inserta 5 categorías y 15 destinos (14 publicados + 1 borrador que
-- sirve para comprobar que RLS oculta los registros no publicados).
--
-- Es idempotente: usa ON CONFLICT (slug) DO UPDATE, por lo que puede
-- ejecutarse de nuevo para restaurar los datos sin duplicarlos.
-- Requiere haber ejecutado antes la migración del esquema.
--
-- Fotografías: Wikimedia Commons (autor y licencia en cada fila).
-- Las imágenes se redimensionaron para la web.
-- =====================================================================

insert into public.categories (name, slug, description) values
  ('Playas del Pacífico', 'playas',
   'Arena volcánica, olas para surfear y atardeceres sobre el océano Pacífico a lo largo de la costa salvadoreña.'),
  ('Volcanes y montañas', 'volcanes-y-montanas',
   'Cráteres, bosques nubosos y miradores en la cadena volcánica que atraviesa el país.'),
  ('Pueblos con encanto', 'pueblos-con-encanto',
   'Calles empedradas, arquitectura colonial, café de altura y tradiciones vivas en los pueblos salvadoreños.'),
  ('Lagos volcánicos', 'lagos-volcanicos',
   'Lagos formados en antiguas calderas volcánicas, ideales para contemplar el paisaje y navegar.'),
  ('Sitios arqueológicos', 'sitios-arqueologicos',
   'Vestigios de las culturas prehispánicas que habitaron el territorio de El Salvador.')
on conflict (slug) do update
  set name = excluded.name,
      description = excluded.description;

with data (name, slug, summary, description, location, image_url, image_alt,
           image_credit, image_license, image_source_url, highlights,
           category_slug, featured, published) as (
  values
  -- ----------------------------------------------------------- Playas
  ('Playa El Tunco', 'playa-el-tunco',
   'Playa de arena volcánica famosa por el surf y por la gran roca que le da nombre.',
   'El Tunco es una de las playas más visitadas de la costa de La Libertad. Su nombre proviene de la formación rocosa frente a la orilla, cuya silueta recuerda a un cerdo ("tunco", en el habla salvadoreña). Sus olas constantes la han convertido en un punto de encuentro de surfistas, y las calles cercanas reúnen hostales, restaurantes y ambiente nocturno.',
   'Tamanique, La Libertad',
   '/images/destinos/playa-el-tunco.jpg',
   'Formación rocosa de El Tunco frente a la orilla al atardecer',
   'William Adach', 'CC BY-SA 2.0',
   'https://commons.wikimedia.org/wiki/File:Playa_el_tuco_rocoso.jpg',
   array['Surf para distintos niveles', 'Atardeceres frente a la roca', 'Restaurantes y hostales cerca de la playa'],
   'playas', true, true),

  ('Playa El Sunzal', 'playa-el-sunzal',
   'Rompiente reconocida por sus olas largas, a pocos minutos de El Tunco.',
   'El Sunzal es una de las rompientes más conocidas del país por sus olas largas y regulares, apreciadas por surfistas de distintas partes del mundo. Su orilla de arena oscura y piedras, rodeada de vegetación y acantilados, ofrece un ambiente más tranquilo que el de las playas vecinas.',
   'Tamanique, La Libertad',
   '/images/destinos/playa-el-sunzal.jpg',
   'Olas rompiendo en la playa El Sunzal con acantilados al fondo',
   'Hermann Luyken', 'CC BY-SA 3.0',
   'https://commons.wikimedia.org/wiki/File:2010.05.05.064818_El_Sunzal_El_Salvador.jpg',
   array['Olas largas y regulares', 'Cercanía con El Tunco', 'Ambiente tranquilo'],
   'playas', false, true),

  ('Playa El Cuco', 'playa-el-cuco',
   'Amplia playa de la zona oriental con extensas franjas de arena y aguas cálidas.',
   'Ubicada en la costa oriental, El Cuco es una playa extensa y de pendiente suave, apreciada para caminar por la orilla y disfrutar de la gastronomía local a base de mariscos. Es también un buen punto de partida para conocer otras playas del oriente del país.',
   'Chirilagua, San Miguel',
   '/images/destinos/playa-el-cuco.jpg',
   'Playa El Cuco con la marea baja reflejando el cielo',
   'Ll1324', 'CC0',
   'https://commons.wikimedia.org/wiki/File:El_Cuco_San_Miguel_El_Salvador_Playa_2011.jpg',
   array['Playa amplia para caminar', 'Gastronomía de mariscos', 'Acceso a otras playas de oriente'],
   'playas', false, true),

  -- -------------------------------------------- Volcanes y montañas
  ('Parque Nacional El Boquerón', 'parque-nacional-el-boqueron',
   'Miradores sobre el cráter principal del volcán de San Salvador, a poca distancia de la capital.',
   'El Boquerón es el cráter principal del volcán de San Salvador. Desde sus miradores se contempla un cráter de alrededor de un kilómetro y medio de diámetro y, en su fondo, un pequeño cono conocido como Boqueroncito, formado durante la erupción de 1917. Su clima fresco y sus senderos entre vegetación lo convierten en una escapada cercana a la ciudad.',
   'Volcán de San Salvador, La Libertad',
   '/images/destinos/parque-nacional-el-boqueron.jpg',
   'Vista del interior del cráter de El Boquerón con el cono del Boqueroncito',
   'Jerrye & Roy Klotz, MD', 'CC BY-SA 3.0',
   'https://commons.wikimedia.org/wiki/File:EL_BOQUERON_NATIONAL_PARK,_EL_SALVADOR.jpg',
   array['Miradores sobre el cráter', 'Senderos de clima fresco', 'Cercanía con San Salvador'],
   'volcanes-y-montanas', true, true),

  ('Parque Nacional Cerro Verde', 'parque-nacional-cerro-verde',
   'Bosque y miradores frente a los volcanes de Santa Ana e Izalco.',
   'Cerro Verde es un antiguo volcán cubierto de vegetación que forma parte del Parque Nacional Los Volcanes. Sus senderos y miradores ofrecen vistas del volcán de Santa Ana (Ilamatepec), del volcán de Izalco y del lago de Coatepeque, y es el punto de partida habitual de las caminatas guiadas hacia el cráter del Ilamatepec.',
   'Parque Nacional Los Volcanes, Santa Ana',
   '/images/destinos/parque-nacional-cerro-verde.jpg',
   'Paisaje de Cerro Verde con el volcán de Santa Ana al fondo',
   'JMRAFFi', 'CC BY 4.0',
   'https://commons.wikimedia.org/wiki/File:Cerro_verde_e_Ilamatepec.jpg',
   array['Vistas de los volcanes de Santa Ana e Izalco', 'Senderos entre bosque', 'Inicio de la caminata al Ilamatepec'],
   'volcanes-y-montanas', false, true),

  ('Volcán de Santa Ana (Ilamatepec)', 'volcan-de-santa-ana',
   'El volcán más alto de El Salvador, con una laguna de tonos verdes dentro de su cráter.',
   'Con cerca de 2,380 metros sobre el nivel del mar, el Ilamatepec es el volcán más alto del país. La caminata guiada hacia la cumbre atraviesa distintos tipos de vegetación y culmina en el borde del cráter, desde donde se observa una laguna de color verde azulado formada por la actividad volcánica, además de amplias vistas del occidente salvadoreño.',
   'Parque Nacional Los Volcanes, Santa Ana',
   '/images/destinos/volcan-de-santa-ana.jpg',
   'Cráter del volcán de Santa Ana con su laguna de color turquesa',
   'Emberlifi', 'CC BY-SA 4.0',
   'https://commons.wikimedia.org/wiki/File:Crat%C3%A8re_du_Volcan_de_Santa_Ana,_Salvador.jpg',
   array['Caminata guiada a la cumbre', 'Laguna dentro del cráter', 'Vistas del occidente del país'],
   'volcanes-y-montanas', true, true),

  -- --------------------------------------------- Pueblos con encanto
  ('Suchitoto', 'suchitoto',
   'Pueblo colonial de calles empedradas con vista al lago Suchitlán.',
   'Suchitoto conserva calles empedradas, casas de arquitectura colonial y una intensa vida cultural. La iglesia de Santa Lucía, de fachada blanca, preside la plaza central, y desde distintos puntos del pueblo se contempla el lago Suchitlán, formado por el embalse Cerrón Grande.',
   'Suchitoto, Cuscatlán',
   '/images/destinos/suchitoto.jpg',
   'Iglesia de Santa Lucía de Suchitoto iluminada al anochecer',
   'ElmerGuevara', 'CC BY-SA 3.0',
   'https://commons.wikimedia.org/wiki/File:Iglesia_De_Suchitoto..JPG',
   array['Arquitectura colonial', 'Vista al lago Suchitlán', 'Galerías y actividades culturales'],
   'pueblos-con-encanto', true, true),

  ('Ruta de las Flores', 'ruta-de-las-flores',
   'Recorrido por pueblos de montaña entre cafetales, miradores y gastronomía local.',
   'La Ruta de las Flores recorre la sierra Apaneca-Ilamatepec y enlaza pueblos como Nahuizalco, Salcoatitán, Juayúa, Apaneca y Concepción de Ataco. El trayecto combina clima fresco, fincas de café, artesanías y miradores; Juayúa es especialmente conocida por su feria gastronómica de fin de semana.',
   'Sonsonate y Ahuachapán',
   '/images/destinos/ruta-de-las-flores.jpg',
   'Calle de Juayúa, uno de los pueblos de la Ruta de las Flores',
   'Erickssonr', 'CC BY-SA 3.0',
   'https://commons.wikimedia.org/wiki/File:Calles_de_Juayua_1.JPG',
   array['Pueblos de montaña', 'Fincas de café', 'Feria gastronómica en Juayúa'],
   'pueblos-con-encanto', false, true),

  ('Concepción de Ataco', 'concepcion-de-ataco',
   'Pueblo de la Ruta de las Flores conocido por sus murales y su café de altura.',
   'Concepción de Ataco es uno de los pueblos más visitados de la Ruta de las Flores. Sus fachadas pintadas con murales coloridos, sus calles empedradas y el café cultivado en los alrededores le dan una identidad propia, ideal para recorrer a pie y visitar sus cafeterías y talleres artesanales.',
   'Concepción de Ataco, Ahuachapán',
   '/images/destinos/concepcion-de-ataco.jpg',
   'Árbol frondoso en el parque central de Concepción de Ataco',
   'Martin Haeusler', 'CC BY-SA 3.0',
   'https://commons.wikimedia.org/wiki/File:Parque_en_Concepci%C3%B3n_de_Ataco_(12-2010)_-_panoramio.jpg',
   array['Murales en las fachadas', 'Café de altura', 'Talleres artesanales'],
   'pueblos-con-encanto', false, true),

  -- ------------------------------------------------ Lagos volcánicos
  ('Lago de Coatepeque', 'lago-de-coatepeque',
   'Lago de origen volcánico rodeado de cerros, famoso por el color de sus aguas.',
   'El lago de Coatepeque ocupa una caldera volcánica en el occidente del país. Rodeado de laderas verdes y con la isla Teopán en su interior, es apreciado por el tono azul turquesa que pueden tomar sus aguas, por los paseos en lancha y por los miradores desde los que se contempla toda la caldera.',
   'El Congo y Coatepeque, Santa Ana',
   '/images/destinos/lago-de-coatepeque.jpg',
   'Vista aérea del lago de Coatepeque con aguas color turquesa',
   'JMRAFFi', 'CC BY-SA 4.0',
   'https://commons.wikimedia.org/wiki/File:Lago_de_coatepeque_de_color.jpg',
   array['Aguas de color turquesa', 'Paseos en lancha', 'Miradores sobre la caldera'],
   'lagos-volcanicos', true, true),

  ('Lago de Ilopango', 'lago-de-ilopango',
   'El lago natural más grande del país, en la caldera del volcán de Ilopango.',
   'El lago de Ilopango ocupa la caldera del volcán del mismo nombre y es el lago natural más grande de El Salvador. En su interior se encuentran los islotes conocidos como Cerros Quemados, surgidos durante la actividad volcánica de 1879 y 1880. Sus orillas se prestan para paseos en lancha, deportes acuáticos y gastronomía local.',
   'Entre San Salvador, Cuscatlán y La Paz',
   '/images/destinos/lago-de-ilopango.jpg',
   'Vista aérea del lago de Ilopango rodeado de colinas verdes',
   'JMRAFFi', 'CC BY-SA 4.0',
   'https://commons.wikimedia.org/wiki/File:Lago_de_Ilopango_ES.jpg',
   array['El lago natural más grande del país', 'Islotes de origen volcánico', 'Paseos en lancha'],
   'lagos-volcanicos', false, true),

  -- -------------------------------------------- Sitios arqueológicos
  ('Joya de Cerén', 'joya-de-ceren',
   'Aldea prehispánica preservada bajo ceniza volcánica, Patrimonio de la Humanidad.',
   'Joya de Cerén es una aldea maya que quedó sepultada por la ceniza de la erupción del volcán Loma Caldera alrededor del año 600 d. C. Gracias a ello se conservaron viviendas, bodegas y un temazcal que muestran la vida cotidiana de sus habitantes. Fue inscrita en la Lista del Patrimonio Mundial de la UNESCO en 1993.',
   'San Juan Opico, La Libertad',
   '/images/destinos/joya-de-ceren.jpg',
   'Estructura de adobe conservada en el sitio arqueológico Joya de Cerén',
   'xiquinhosilva', 'CC BY 4.0',
   'https://commons.wikimedia.org/wiki/File:Parque_Arqueol%C3%B3gico_Joya_de_Cer%C3%A9n_-_55385099541.jpg',
   array['Patrimonio Mundial de la UNESCO', 'Vida cotidiana prehispánica', 'Museo de sitio'],
   'sitios-arqueologicos', true, true),

  ('Tazumal', 'tazumal',
   'Uno de los sitios arqueológicos más importantes del occidente salvadoreño.',
   'Tazumal es un sitio arqueológico maya ubicado en Chalchuapa. Su estructura principal, una pirámide escalonada, se construyó en varias etapas a lo largo de siglos de ocupación. El parque cuenta con un museo que exhibe piezas halladas en la zona y explica la importancia de Chalchuapa en la historia prehispánica de la región.',
   'Chalchuapa, Santa Ana',
   '/images/destinos/tazumal.jpg',
   'Pirámide escalonada del sitio arqueológico Tazumal bajo cielo azul',
   'ARamirez69', 'CC BY-SA 3.0',
   'https://commons.wikimedia.org/wiki/File:El_Tazumal,_Chalchuapa.jpg',
   array['Pirámide escalonada', 'Museo de sitio', 'Historia maya de Chalchuapa'],
   'sitios-arqueologicos', false, true),

  ('Sitio Arqueológico San Andrés', 'san-andres',
   'Acrópolis prehispánica en el valle de Zapotitán, con museo y obraje de añil colonial.',
   'San Andrés fue un importante centro prehispánico del valle de Zapotitán. Su parque arqueológico conserva una acrópolis con estructuras piramidales cubiertas de césped y un museo de sitio. También resguarda los restos de un obraje de añil de la época colonial, que muestra la importancia de este tinte en la historia del país.',
   'Valle de Zapotitán, La Libertad',
   '/images/destinos/san-andres.jpg',
   'Estructuras piramidales cubiertas de césped en el sitio arqueológico San Andrés',
   'Arita07', 'CC BY-SA 4.0',
   'https://commons.wikimedia.org/wiki/File:Sitio_Arqueol%C3%B3gico_de_San_Andr%C3%A9s,_El_Salvador.jpg',
   array['Acrópolis prehispánica', 'Obraje de añil colonial', 'Museo de sitio'],
   'sitios-arqueologicos', false, true),

  -- --------------------------------- Borrador (no publicado, oculto por RLS)
  ('Bahía de Jiquilisco', 'bahia-de-jiquilisco',
   'Borrador en preparación: no debe aparecer en el sitio público.',
   'Registro de prueba con published = false. Sirve para verificar que la política RLS impide que el cliente público lo lea.',
   'Usulután',
   '/images/destinos/playa-el-cuco.jpg',
   'Imagen provisional',
   'Ll1324', 'CC0',
   'https://commons.wikimedia.org/wiki/File:El_Cuco_San_Miguel_El_Salvador_Playa_2011.jpg',
   array[]::text[],
   'playas', false, false)
)
insert into public.destinations (
  name, slug, summary, description, location, image_url, image_alt,
  image_credit, image_license, image_source_url, highlights,
  category_id, featured, published
)
select d.name, d.slug, d.summary, d.description, d.location, d.image_url, d.image_alt,
       d.image_credit, d.image_license, d.image_source_url, d.highlights,
       c.id, d.featured, d.published
from data d
join public.categories c on c.slug = d.category_slug
on conflict (slug) do update
  set name             = excluded.name,
      summary          = excluded.summary,
      description      = excluded.description,
      location         = excluded.location,
      image_url        = excluded.image_url,
      image_alt        = excluded.image_alt,
      image_credit     = excluded.image_credit,
      image_license    = excluded.image_license,
      image_source_url = excluded.image_source_url,
      highlights       = excluded.highlights,
      category_id      = excluded.category_id,
      featured         = excluded.featured,
      published        = excluded.published;
