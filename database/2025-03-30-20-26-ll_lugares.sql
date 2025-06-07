-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 30-03-2025 a las 23:25:44
-- Versión del servidor: 10.11.11-MariaDB-cll-lve
-- Versión de PHP: 8.3.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `iunaorg_doli184`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ll_lugares`
--

CREATE TABLE `ll_lugares` (
  `id` int(11) NOT NULL,
  `place_id` varchar(255) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `telefono` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `sitio_web` varchar(255) DEFAULT NULL,
  `latitud` decimal(10,7) DEFAULT NULL,
  `longitud` decimal(10,7) DEFAULT NULL,
  `rubro_id` int(11) DEFAULT NULL,
  `zona_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `ll_lugares`
--

INSERT INTO `ll_lugares` (`id`, `place_id`, `nombre`, `direccion`, `telefono`, `email`, `sitio_web`, `latitud`, `longitud`, `rubro_id`, `zona_id`, `created_at`) VALUES
(1, 'ChIJ31yUd2LTvJURJN1TY7N1AZU', 'Llegó tu hora...', 'Italia 420, Lomas de Zamora', '', NULL, 'https://www.instagram.com/llegotuhora4.20/?hl=es-la', -34.7654752, -58.4017099, 89, 9, '2025-03-30 15:53:09'),
(2, 'ChIJZcyzQNbQvJURoOHUoUvo0XA', 'El Sereno Bar', 'Lucio Salvadores 617, Ezeiza', '011 6528-4346', NULL, '', -34.8469431, -58.5101765, 89, 5, '2025-03-30 15:53:10'),
(3, 'ChIJWdXp8iYto5URUzTkqUzggrA', 'Ozono Bar', 'esquina y (barrio san jose Buenos Aires AR, Jujuy, Adrogué', '011 4264-7387', NULL, '', -34.7658740, -58.3568680, 89, 9, '2025-03-30 15:53:10'),
(4, 'ChIJ57EDJEEzo5UROabyOkXRCxU', 'Los primos restó bar', 'Salvador Soreda 6235, Wilde', '011 7119-9477', NULL, 'http://losprimosrestobar.com/', -34.6997675, -58.3119740, 89, 9, '2025-03-30 15:53:11'),
(5, 'ChIJ9ycZgH3NvJUREh9kjtwodSw', 'open bar', 'RN205 4630, B1826DQF', '', NULL, '', -34.7089885, -58.3916565, 89, 9, '2025-03-30 15:53:12'),
(6, 'ChIJZVxq87oso5URKSEoE6Ab6tA', 'CRASH Resto-bar', 'Gral. Martín Miguel de Güemes 1975-1999, Rafael Calzada', '', NULL, '', -34.7977790, -58.3589477, 89, 9, '2025-03-30 15:53:12'),
(7, 'ChIJgeY7nX3PvJURbmwkcJcoDsc', 'Resto Bar Jhoana', 'Franklin Delano Roosevelt 787, Villa Celina', '011 5408-4134', NULL, '', -34.7018051, -58.4841879, 89, 6, '2025-03-30 15:53:13'),
(8, 'ChIJK1iGZrcso5URvdiIANxswxg', 'Bumbury Resto-Bar', 'Av. San Martín 3194, Gran Buenos Aires', '011 4219-5958', NULL, '', -34.7940299, -58.3608914, 89, 9, '2025-03-30 15:53:13'),
(9, 'ChIJYzty02Uyo5URvmnnIRnsl1k', 'Cafeto Bar', 'ABS, Av. Bartolomé Mitre 6298, Wilde', '011 4227-1377', NULL, 'http://www.facebook.com/cafetobar', -34.7037944, -58.3173028, 89, 9, '2025-03-30 15:53:14'),
(10, 'ChIJsQAZiabOvJURHY423q5kfTE', 'Bar Astorias', 'C1439 Buenos Aires, Argentina', '', NULL, '', -34.6947241, -58.4678042, 89, 9, '2025-03-30 15:53:15'),
(11, 'ChIJAaIDpFXTvJURHD1WW20m7NU', 'La Birra Bar Banfield', 'Av. Adolfo Alsina 400, B1832AHH, Banfield', '011 4416-7107', NULL, '', -34.7408774, -58.3926280, 89, 9, '2025-03-30 15:53:15'),
(12, 'ChIJ354Bnb7NvJURnNYPADpX-UU', 'Bar \"Mi Esquina\"', 'Campoamor y Canada, Lomas de Zamora', '', NULL, '', -34.7198033, -58.4506255, 89, 4, '2025-03-30 15:53:16'),
(13, 'ChIJB_Yxc1vTvJURqR85XFudQe4', 'The Mitre Bar & Restaurant', 'Bartolomé Mitre 1171, Adrogué', '011 2896-2552', NULL, '', -34.7972546, -58.3917957, 89, 9, '2025-03-30 15:53:16'),
(14, 'ChIJcbwOI-7TvJURfaz4xTI-FDo', 'Guada RESTO BAR', 'Loria 154, Lomas de Zamora', '011 4928-2763', NULL, '', -34.7634222, -58.3994215, 89, 9, '2025-03-30 15:53:17'),
(15, 'ChIJ9VVvwCHNvJURkEhBRlMBd_U', 'Dolce Vita', 'E. Del Valle Iberlucea 2824, Gran Buenos Aires', '011 4892-6502', NULL, '', -34.7040164, -58.3931089, 89, 5, '2025-03-30 15:53:18'),
(16, 'ChIJoRp4zUHTvJURPdBqWv0pYfc', 'Bar del Tano', 'ASY, Leandro N. Alem 1201, Monte Grande', '011 4296-7038', NULL, '', -34.8267814, -58.4604687, 89, 9, '2025-03-30 15:53:18'),
(17, 'ChIJ5R2ukbfTvJURA7cnOKzdqkU', 'RESTO - BAR', 'Antártida Argentina 2400-2302, Llavallol', '', NULL, 'http://www.megafutbol.com.ar/', -34.8019516, -58.4325211, 89, 9, '2025-03-30 15:53:19'),
(18, 'ChIJeVVFwi8to5URZNloX1XxZLA', 'New Style Bar - Pool', 'Av. Eva Perón 2491, Gran Buenos Aires', '011 4264-3940', NULL, 'http://www.facebook.com/nuevoestilopooltemperley', -34.7618515, -58.3618354, 89, 9, '2025-03-30 15:53:20'),
(19, 'ChIJS5MK2FDRvJURrCldvlqEIUM', 'Bar del roca', 'Paso de la Patria 455, Ezeiza', '011 3691-3615', NULL, '', -34.8565765, -58.5236641, 89, 1, '2025-03-30 15:53:20'),
(20, 'ChIJq_D1C7rRvJURuAIGfMhKw44', 'Baco bar', 'Av. Dardo Rocha 494, B1842ABJ, Monte Grande', '', NULL, '', -34.8186918, -58.4750503, 89, 9, '2025-03-30 15:53:21'),
(21, 'ChIJjdWS9MTMvJURNC1srHvxExI', 'Pituca Bar', 'Av. Hipólito Yrigoyen 2535, Gerli', '011 6496-9298', NULL, 'https://www.facebook.com/PITUCA-BAR', -34.6865813, -58.3873987, 89, 9, '2025-03-30 15:53:24'),
(22, 'ChIJV5h41srNvJURM_NFxOas4kE', 'Que Burger Bar', 'Ricardo Palma 890 B1821FLR, Ingeniero Budge', '', NULL, '', -34.7308818, -58.4513558, 89, 6, '2025-03-30 15:53:24'),
(23, 'ChIJ2w0XIIfOvJUR7Hu5M2sjMMo', 'BAR ROCCO', 'Ingeniero Budge', '011 5098-7760', NULL, '', -34.7209792, -58.4711351, 89, 9, '2025-03-30 15:53:25'),
(24, 'ChIJufQOtdHTvJURvozJFeCy9pQ', 'El Bufet Bar', 'Samuel Miguel Spiro 1093, Adrogué', '011 3892-3164', NULL, '', -34.7987440, -58.3915166, 89, 9, '2025-03-30 15:53:26'),
(25, 'ChIJkwU6zs3QvJURJmimG7aUl50', 'Ron Resto Bar', 'Pres. Perón 17 49, Ezeiza', '011 4433-7798', NULL, '', -34.8526432, -58.5225110, 89, 1, '2025-03-30 15:53:26'),
(26, 'ChIJiwNHi-Qto5UR0h0dRkU2ORQ', 'La manija disco bar', 'Av. Eva Perón, Temperley', '', NULL, '', -34.7589899, -58.3571268, 89, 9, '2025-03-30 15:53:27'),
(27, 'ChIJ38_k-2Uso5URJhqZtJzEO2k', 'Lo De Tato Resto-Bar', 'San Francisco Solano', '011 5165-8203', NULL, '', -34.7826642, -58.3150778, 89, 9, '2025-03-30 15:53:27'),
(28, 'ChIJqWleD-rPvJUR8QQKU0Vm1sk', 'Resto-bar', 'Juan Facundo quiroga 1380, Santa Catalina, Lomas de Zamora', '', NULL, '', -34.7490161, -58.4744520, 89, 9, '2025-03-30 15:53:28'),
(29, 'ChIJe72ZYNvMvJURJ5xjoOzUI-A', 'El Lusitano Bar', 'Av. Hipólito Yrigoyen 2918, Lanús', '', NULL, '', -34.6903986, -58.3885488, 89, 9, '2025-03-30 15:53:28'),
(30, 'ChIJ4aGF0k3TvJURRbjB4Ci_URY', 'Bouchardito Bar', 'Peña, Gral. Arenales &, Banfield', '011 2869-3900', NULL, '', -34.7512003, -58.3882527, 89, 9, '2025-03-30 15:53:29'),
(31, 'ChIJk2rEdD3TvJURBkwFn9TSS8Y', 'Bar del motociclista', 'Sta. Mónica 263, Lomas de Zamora', '011 6998-4206', NULL, '', -34.7631062, -58.4418012, 89, 6, '2025-03-30 15:53:30'),
(32, 'ChIJFTCxm9zTvJURsX3dJhUsAVM', 'El Surtidor Bar', 'Blvd. Buenos Aires 998, Monte Grande', '', NULL, '', -34.8126650, -58.4537747, 89, 9, '2025-03-30 15:53:30'),
(33, 'ChIJ6clMqtHMvJURLHeNqpJR_Hk', 'BAR POCHO', 'Av. Teodoro Sánchez de Bustamante 460, Gerli', '011 4205-9197', NULL, '', -34.6890255, -58.3799765, 89, 9, '2025-03-30 15:53:31'),
(34, 'ChIJ_fJLMjfPvJURZiYnPCbbKVA', 'BAR DE MINAS', 'Donovan 1768, Tapiales', '', NULL, '', -34.7052004, -58.5048336, 89, 9, '2025-03-30 15:53:31'),
(35, 'ChIJs1xjXfvRvJURk6hhZyaQ1cI', 'El Bar de Dorrego', 'Cnel. Dorrego 177, Monte Grande', '011 2739-0822', NULL, 'https://www.instagram.com/bardedorrego', -34.8173997, -58.4712054, 89, 9, '2025-03-30 15:53:32'),
(36, 'ChIJn7xTFYjTvJURw4PGmq-pImE', 'Tato\'s Bar', 'C. Molina Arrotea 1203, Lomas de Zamora', '', NULL, '', -34.7667806, -58.4162811, 89, 9, '2025-03-30 15:53:32'),
(37, 'ChIJ5UC0Np7NvJURw5NgrCAYlCc', 'Resto Bar Minutas JC BAR', 'Av. Hipólito Yrigoyen 3901, B1824AAI', '011 2553-4784', NULL, '', -34.7004465, -58.3921771, 89, 9, '2025-03-30 15:53:33'),
(38, 'ChIJ8bU_w0_TvJURFVL_ZdQwQsU', 'The House Bar', 'Bartolomé Cerretti 831, Adrogué', '011 2405-2910', NULL, '', -34.7979968, -58.3877093, 89, 9, '2025-03-30 15:53:34'),
(39, 'ChIJ9-RoVfPRvJUR4mBKlACIig4', 'Santo Domingo', 'Cnel. Dorrego 150, Monte Grande', '011 6814-8488', NULL, 'https://linktr.ee/santodomingobar', -34.8170529, -58.4711641, 89, 9, '2025-03-30 15:53:34'),
(40, 'ChIJH-SyB9_UvJURfZDz4LZ904w', 'ROMA bar-pool', 'Boulogne Sur Mer 1580, Longchamps', '011 6861-3703', NULL, '', -34.8571011, -58.3914222, 89, 3, '2025-03-30 15:53:35'),
(41, 'ChIJ4xgAh5jTvJURgr558dM2iPk', 'El pasaje bar', 'Pje. Estrada 435, Adrogué', '', NULL, 'https://instagram.com/elpasaje.bar?igshid=MzRlODBiNWFlZA==', -34.7966178, -58.3941216, 89, 9, '2025-03-30 15:53:38'),
(42, 'ChIJCwSQoZrNvJURiHPsUOrpeDQ', 'Tuka Bar', 'E. Del Valle Iberlucea 2559, Lanús', '011 15-3729-9144', NULL, 'https://instagram.com/tuka_bar', -34.7007812, -58.3934463, 89, 9, '2025-03-30 15:53:39'),
(43, 'ChIJPy-i8Q3PvJURK5HkUDnkAYw', 'Bar El Cuervo', 'Martín Miguel de Güemes 4197, Cdad. Evita', '', NULL, 'https://www.facebook.com/El-Cuervo-Bar-166460066750210/', -34.7293806, -58.5268407, 89, 7, '2025-03-30 15:53:39'),
(44, 'ChIJqdhMWQAto5UREQ0I8hzCni8', 'Garibaldi Resto Bar', 'Av. San Martín 3170, Rafael Calzada', '', NULL, '', -34.7942059, -58.3612427, 89, 9, '2025-03-30 15:53:40'),
(45, 'ChIJeUjRT14to5URbA3oMYawKOE', 'La Academia Bar', 'Monte Chingolo', '', NULL, '', -34.7310282, -58.3509936, 89, 9, '2025-03-30 15:53:40'),
(46, 'ChIJ3WwlzsbIvJURGLNwZIhZnPs', 'BAR PO PARRILLA', 'Alvear 4802, La Tablada', '', NULL, '', -34.6846633, -58.5278067, 89, 7, '2025-03-30 15:53:41'),
(47, 'ChIJZYjJRZXSvJUR338ENK0WLKo', 'Normanda Bar', 'Fonrouge 176, Lomas de Zamora', '', NULL, '', -34.7599981, -58.3953040, 89, 9, '2025-03-30 15:53:42'),
(48, 'ChIJESlzeWfTvJUR6Zh1-2jVoyc', 'Buchardo Bar', 'Av. Adolfo Alsina 535 B1832AHK, Banfield', '011 2869-3900', NULL, '', -34.7425431, -58.3932608, 89, 9, '2025-03-30 15:53:42'),
(49, 'ChIJf2t8ensto5URvMti86KQxjc', 'La Terraza Disco Bar', 'Salta, Temperley', '011 7092-5352', NULL, '', -34.7690633, -58.3559216, 89, 9, '2025-03-30 15:53:43'),
(50, 'ChIJ1ye6x2rTvJURnoxcCo_-ddM', 'Gibson Bar', 'Benigno Macias 589, Adrogué', '011 2239-3411', NULL, 'https://www.instagram.com/gibsonbar_adrogue/', -34.7968203, -58.3914882, 89, 9, '2025-03-30 15:53:43'),
(51, 'ChIJkXLBTHAzo5URjWvYWYexsLg', 'Clos Bar', 'Bahía Blanca 171, Wilde', '011 6932-2131', NULL, '', -34.7006041, -58.3177983, 89, 9, '2025-03-30 15:53:44'),
(52, 'ChIJ89lTwSvTvJURmubYgYekaJs', 'Asia disco bar', 'Av. Hipólito Yrigoyen 13633, Burzaco', '', NULL, '', -34.8134585, -58.3987865, 89, 9, '2025-03-30 15:53:44'),
(53, 'ChIJA9oJrp3RvJURyZtA-Uv3QEI', 'El templo bar', 'O. Petrazzini 138, Monte Grande', '', NULL, '', -34.8157189, -58.4712631, 89, 9, '2025-03-30 15:53:45'),
(54, 'ChIJ-VdtJyjXvJURYhSNn7gU7qU', 'Bahia Bar Canning', 'Ruta 52 y, Formosa, Ezeiza', '011 5872-8043', NULL, '', -34.8550038, -58.5034678, 89, 3, '2025-03-30 15:53:46'),
(55, 'ChIJOWT19mkso5URXCmYGkh4IcE', 'Pub Retro Bar Pool', 'C. 895 4460, San Francisco Solano', '011 2769-3340', NULL, '', -34.7799568, -58.3106880, 89, 9, '2025-03-30 15:53:46'),
(56, 'ChIJV6jrxPUzo5URY5LeYIsXq_I', 'Buffete América Bar', 'Villa Domínico', '011 3972-6658', NULL, '', -34.6946926, -58.3409841, 89, 6, '2025-03-30 15:53:47'),
(57, 'ChIJic3zIwAzo5URH7pKjjJGEPg', 'Temple bar', 'Puerto Madero', '', NULL, '', -34.6904220, -58.3338339, 89, 9, '2025-03-30 15:53:47'),
(58, 'ChIJEbT8i34to5URqgGG_0JO4O8', 'Bar Garibaldi', 'Colón 3201, Rafael Calzada', '2098-8975', NULL, 'https://borders.bistrosoft.com/menu?commerceId=11111568&originName=Mostrador&fbclid=PAAaa7kj8PKXERFsJOfRxfpeef3d29e9h1a6zUSp6zHRgv5DowDV0yorJeheE', -34.7952529, -58.3574322, 89, 8, '2025-03-30 15:53:48'),
(59, 'ChIJnxXndqqwvJURLIRSKhC0xnM', 'Bar de eventos', 'Baldomero Fernández Moreno 144, Lomas de Zamora', '011 4183-7870', NULL, 'http://bardeeventos.com/', -34.7584300, -58.4270893, 89, 8, '2025-03-30 15:53:49'),
(60, 'ChIJN_R17yjMvJURXJ4vRz3ApPo', 'Babilonia Bar', 'Guaminí 2540, Ingeniero Budge', '', NULL, '', -34.7112796, -58.4592828, 89, 6, '2025-03-30 15:53:49'),
(91, 'ChIJz__MWosto5UR9thY7McCsrk', 'Bar Fangio', 'Av. Los Quilmes, Bernal Oeste', '', NULL, '', -34.7188705, -58.3040911, 89, 9, '2025-03-30 15:54:06'),
(117, 'ChIJ7aJOLDjNvJURYcvOHEcz1xo', 'Bond Bar', 'Gdor. Irigoyen 57 Lanus, Buenos Aires', '011 7635-5162', NULL, 'https://www.instagram.com/_bondbar/', -34.7054201, -58.3926118, 89, 6, '2025-03-30 15:54:20'),
(118, 'ChIJ90QIb8jTvJURLGN6TkSMrds', 'Three Monkeys Brew Bar', 'Oliden 94, Lomas de Zamora', '011 3919-2596', NULL, 'http://instagram.com/threemonkeysbrewbar', -34.7656888, -58.4050362, 89, 6, '2025-03-30 15:54:21'),
(119, 'ChIJx1yh7_jVvJURRn5NfrpwBnU', 'Límite zero bar-poll', 'Tilcara, Blvd. Tomás Espora &, Burzaco', '', NULL, '', -34.8358801, -58.3839611, 89, 6, '2025-03-30 15:54:21'),
(120, 'ChIJcWMLnsLRvJURLTzNTshZdFI', 'Constantine Bar', 'Cnel. Dorrego 23, Monte Grande', '', NULL, '', -34.8159804, -58.4722284, 89, 3, '2025-03-30 15:54:22'),
(164, 'ChIJXSEKKtEto5URPdzDDxDIKbA', 'Bar Pool Pascual', 'Juan B. Justo 1694, Quilmes Oeste', '011 6951-4480', NULL, '', -34.7417021, -58.2863048, 89, 9, '2025-03-30 15:54:46'),
(165, 'ChIJB9O_ZQ4yo5URkoa1Uxwg9OI', 'Bar Paul\'s', 'Chaco 46, Don Bosco', '', NULL, '', -34.7043394, -58.2965755, 89, 9, '2025-03-30 15:54:47'),
(183, 'ChIJ57vgozYzo5URrQXbEWTudeg', 'Nacho\'s Bar', 'Gral. Güemes 876, Sarandí', '011 6627-6422', NULL, '', -34.6765584, -58.3655018, 89, 9, '2025-03-30 15:54:55'),
(189, 'ChIJL-dgVZDMvJURT-Pb2aDthAM', 'Bar PUNTO LÍMITE', 'AGC, Av. Tte. Gral. Juan Domingo Perón 2277, Valentín Alsina', '011 6061-1273', NULL, '', -34.6756927, -58.4030221, 89, 9, '2025-03-30 15:54:58'),
(275, 'ChIJleyBEZHMvJURYdrMSMXVw0k', 'Bar El Mundial', 'Valentín Alsina', '', NULL, '', -34.6772956, -58.4011306, 89, 9, '2025-03-30 15:55:58'),
(367, 'ChIJxV5t4BrJvJUR3dRhIaCt8hs', 'Bar Oviedo', 'Av. Lisandro de la Torre 2407', '011 4687-8690', NULL, '', -34.6627725, -58.5001496, 89, 9, '2025-03-30 15:57:05'),
(369, 'ChIJq80BDY8zo5URzO8ERKY23aA', 'Herrenhaus Bar', 'Laprida 47, Avellaneda', '011 4449-8996', NULL, 'https://linktr.ee/lamansionbar', -34.6636353, -58.3617572, 89, 9, '2025-03-30 15:57:06'),
(377, 'ChIJh7MnIRvJvJURqMGgpUR-EwU', 'Resto Bar', 'Av. Lisandro de la Torre 2375', '011 4686-6258', NULL, '', -34.6622765, -58.5007501, 89, 9, '2025-03-30 15:57:11'),
(378, 'ChIJ945WCmzJvJURZBQRJ-30NoQ', 'La Piedra', 'Corvalán 2497', '', NULL, '', -34.6608667, -58.4815357, 89, 9, '2025-03-30 15:57:12'),
(391, 'ChIJL1PflY3LvJUR_3qdvCUpLlg', 'Cliza Resto Bar', 'Av. Gral. Francisco Fernández de la Cruz 3624', '011 5712-0453', NULL, '', -34.6644750, -58.4487558, 89, 9, '2025-03-30 15:57:21'),
(393, 'ChIJE0nPHgAzo5UR-9tlaSdqF6E', 'Gadd Bar', 'Av. Bartolomé Mitre 1665, Crucecita', '', NULL, 'https://www.instagram.com/gaddbar?igsh=MWhwOGNneGV1bGg4Yg==', -34.6672369, -58.3567452, 89, 9, '2025-03-30 15:57:22'),
(399, 'ChIJm_7IgBTJvJUR0sSH_y5B7eE', 'Bar Las Vegas', 'Av. Eva Perón 5900', '011 2087-8417', NULL, '', -34.6634271, -58.4886704, 89, 9, '2025-03-30 15:57:25'),
(405, 'ChIJ61iNuE4zo5UR2C04LLGkNss', 'EL Bar Del Pela', 'Italia 273 305, B1870COF, Avellaneda', '', NULL, '', -34.6666223, -58.3644815, 89, 9, '2025-03-30 15:57:30'),
(408, 'ChIJpxwTKgDLvJURh6dfwxDEr4Y', 'Willy\'s Bar', 'Membrillar 401 449, B1824FJE B1824FJE, Valentín Alsina', '', NULL, '', -34.6625096, -58.4156296, 89, 9, '2025-03-30 15:57:32'),
(412, 'ChIJxYu0_EYzo5URDpfBLTk1rH0', 'Lobos Bar', 'Av. Bartolomé Mitre 1679, Crucecita', '', NULL, '', -34.6672570, -58.3567304, 89, 9, '2025-03-30 15:57:34');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ll_lugares`
--
ALTER TABLE `ll_lugares`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `place_id` (`place_id`),
  ADD KEY `rubro_id` (`rubro_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ll_lugares`
--
ALTER TABLE `ll_lugares`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=541;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ll_lugares`
--
ALTER TABLE `ll_lugares`
  ADD CONSTRAINT `ll_lugares_ibfk_1` FOREIGN KEY (`rubro_id`) REFERENCES `ll_rubros` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
