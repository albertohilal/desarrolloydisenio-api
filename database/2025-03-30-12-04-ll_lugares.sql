-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 30-03-2025 a las 15:04:35
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
(1, 'ChIJs1xjXfvRvJURk6hhZyaQ1cI', 'El Bar de Dorrego', 'Cnel. Dorrego 177, Monte Grande', '', '', '', -34.8173997, -58.4712054, 131, NULL, '2025-03-26 00:12:33'),
(2, 'ChIJ9-RoVfPRvJUR4mBKlACIig4', 'Santo Domingo', 'Cnel. Dorrego 150, Monte Grande', '', '', '', -34.8170529, -58.4711641, 131, NULL, '2025-03-26 00:12:35'),
(3, 'ChIJ31yUd2LTvJURJN1TY7N1AZU', 'Llegó tu hora...', 'Italia 420, Lomas de Zamora', '', '', '', -34.7654752, -58.4017099, 131, NULL, '2025-03-26 00:12:36'),
(4, 'ChIJn7xTFYjTvJURw4PGmq-pImE', 'Tato\'s Bar', 'C. Molina Arrotea 1203, Lomas de Zamora', '', '', '', -34.7667806, -58.4162811, 131, NULL, '2025-03-26 00:12:37'),
(5, 'ChIJeUjRT14to5URbA3oMYawKOE', 'La Academia Bar', 'Monte Chingolo', '', '', '', -34.7310282, -58.3509936, 131, NULL, '2025-03-26 00:12:38'),
(6, 'ChIJCwSQoZrNvJURiHPsUOrpeDQ', 'Tuka Bar', 'E. Del Valle Iberlucea 2559, Lanús', '', '', '', -34.7007812, -58.3934463, 131, NULL, '2025-03-26 00:12:40'),
(7, 'ChIJed2oPzozo5URbeksIVa5_P4', 'Pool Over Bar Lanús', 'Centenario Uruguayo 1385, Monte Chingolo', '', '', '', -34.7208155, -58.3611301, 131, NULL, '2025-03-26 00:12:41'),
(8, 'ChIJESlzeWfTvJUR6Zh1-2jVoyc', 'Buchardo Bar', 'Av. Adolfo Alsina 535 B1832AHK, Banfield', '', '', '', -34.7425431, -58.3932608, 131, NULL, '2025-03-26 00:12:42'),
(9, 'ChIJXSEKKtEto5URPdzDDxDIKbA', 'Bar Pool Pascual', 'Juan B. Justo 1694, Quilmes Oeste', '', '', '', -34.7417021, -58.2863048, 131, NULL, '2025-03-26 00:12:44'),
(10, 'ChIJOWT19mkso5URXCmYGkh4IcE', 'Pub Retro Bar Pool', 'C. 895 4460, San Francisco Solano', '', '', '', -34.7799568, -58.3106880, 131, NULL, '2025-03-26 00:12:45'),
(11, 'ChIJ0bSor3TNvJUR0SOHK10-74c', 'El Bar de La Plaza Lanus', 'Av. 9 de Julio 1921, Lanús', '', '', '', -34.7135978, -58.3825834, 131, NULL, '2025-03-26 00:12:46'),
(12, 'ChIJT_CMiRozo5URa9WHoGLl-Xo', 'Luton Bar', 'Mariano Moreno 6263, Wilde', '', '', '', -34.7036478, -58.3157536, 131, NULL, '2025-03-26 00:12:47'),
(13, 'ChIJQ-XnDKPUvJURIuI6VCO6IvI', 'Bar Tío Bizarro', 'Carlos Pellegrini 800, Burzaco', '', '', '', -34.8249215, -58.3903895, 131, NULL, '2025-03-26 00:12:49'),
(14, 'ChIJ57vgozYzo5URrQXbEWTudeg', 'Nacho\'s Bar', 'Gral. Güemes 876, Sarandí', '', '', '', -34.6765584, -58.3655018, 131, NULL, '2025-03-26 00:12:50'),
(15, 'ChIJv90dpSHNvJURGTt1D1xGXwU', 'Ginebra Bar', 'B1824MYB, Gobernador Felipe Llavallol 11, Lanús', '', '', '', -34.7033273, -58.3922628, 131, NULL, '2025-03-26 00:12:51'),
(16, 'ChIJN_R17yjMvJURXJ4vRz3ApPo', 'Babilonia Bar', 'Guaminí 2540, Ingeniero Budge', '', '', '', -34.7112796, -58.4592828, 131, NULL, '2025-03-26 00:12:52'),
(17, 'ChIJWdXp8iYto5URUzTkqUzggrA', 'Ozono Bar', 'esquina y (barrio san jose Buenos Aires AR, Jujuy, Adrogué', '', '', '', -34.7658740, -58.3568680, 131, NULL, '2025-03-26 00:12:53'),
(18, 'ChIJ1ye6x2rTvJURnoxcCo_-ddM', 'Gibson Bar', 'Benigno Macias 589, Adrogué', '', '', '', -34.7968203, -58.3914882, 131, NULL, '2025-03-26 00:12:55'),
(19, 'ChIJz0Fr0ZPMvJURIGBedjE37IU', 'Bahía Pool Bar Café', '2099 gerli Buenos Aires AR, Tuyutí 2085 B1823CBI, Lanús', '', '', '', -34.6786554, -58.4024276, 131, NULL, '2025-03-26 00:12:56'),
(20, 'ChIJkXLBTHAzo5URjWvYWYexsLg', 'Clos Bar', 'Bahía Blanca 171, Wilde', '', '', '', -34.7006041, -58.3177983, 131, NULL, '2025-03-26 00:12:57'),
(21, 'ChIJ9ycZgH3NvJUREh9kjtwodSw', 'open bar', 'RN205 4630, B1826DQF', '', '', '', -34.7089885, -58.3916565, 131, NULL, '2025-03-26 00:12:58'),
(22, 'ChIJo89d32Uyo5URxSc9GAuRW8Q', 'Bar 1890', 'DDB, Las Flores 100, Wilde', '', '', '', -34.7030386, -58.3164686, 131, NULL, '2025-03-26 00:12:59'),
(23, 'ChIJAaIDpFXTvJURHD1WW20m7NU', 'La Birra Bar Banfield', 'Av. Adolfo Alsina 400, B1832AHH, Banfield', '', '', '', -34.7408774, -58.3926280, 131, NULL, '2025-03-26 00:13:00'),
(24, 'ChIJ7aJOLDjNvJURYcvOHEcz1xo', 'Bond Bar', 'Gdor. Irigoyen 57 Lanus, Buenos Aires', '', '', '', -34.7054201, -58.3926118, 131, NULL, '2025-03-26 00:13:02'),
(25, 'ChIJn2ZOej_TvJURs0wOUKUJPoA', 'Guernica Bar', 'Jorge San Pellerano 706, FHD', '', '', '', -34.7988853, -58.3913412, 131, NULL, '2025-03-26 00:13:03'),
(26, 'ChIJkX434D7TvJURfQZjANm1I-U', 'Huelga bar', 'Bartolomé Mitre 1299 1229, B1846DTH, Adrogué', '', '', '', -34.7963781, -58.3903673, 131, NULL, '2025-03-26 00:13:04'),
(27, 'ChIJkzBikyXNvJURfCa8SdKO6R8', 'Goyeneche - Bar de Pizzas', 'Gdor. Carlos Tejedor 96, Lanús', '', '', '', -34.7024995, -58.3931485, 131, NULL, '2025-03-26 00:13:05'),
(28, 'ChIJsz-fdirJvJURM0-wGQZXJcI', 'Bar Los Intocables (Icono Del Barrio)', 'La Bajada 400, Villa Madero', '', '', '', -34.6902748, -58.5084418, 131, NULL, '2025-03-26 00:13:06'),
(29, 'ChIJB_Yxc1vTvJURqR85XFudQe4', 'The Mitre Bar & Restaurant', 'Bartolomé Mitre 1171, Adrogué', '', '', '', -34.7972546, -58.3917957, 131, NULL, '2025-03-26 00:13:08'),
(30, 'ChIJZVxq87oso5URKSEoE6Ab6tA', 'CRASH Resto-bar', 'Gral. Martín Miguel de Güemes 1975-1999, Rafael Calzada', '', '', '', -34.7977790, -58.3589477, 131, NULL, '2025-03-26 00:13:09'),
(31, 'ChIJL-dgVZDMvJURT-Pb2aDthAM', 'Bar PUNTO LÍMITE', 'AGC, Av. Tte. Gral. Juan Domingo Perón 2277, Valentín Alsina', '', '', '', -34.6756927, -58.4030221, 131, NULL, '2025-03-26 00:13:10'),
(32, 'ChIJ1bzh93jVvJURlfxINSdl6Lo', 'De la Barra Cervecería & Resto Bar', 'Av. Hipólito Yrigoyen 14770, Burzaco', '', '', '', -34.8259811, -58.3971678, 131, NULL, '2025-03-26 00:13:11'),
(33, 'ChIJoRp4zUHTvJURPdBqWv0pYfc', 'Bar del Tano', 'ASY, Leandro N. Alem 1201, Monte Grande', '', '', '', -34.8267814, -58.4604687, 131, NULL, '2025-03-26 00:13:13'),
(34, 'ChIJEbT8i34to5URqgGG_0JO4O8', 'Bar Garibaldi', 'Colón 3201, Rafael Calzada', '', '', '', -34.7952529, -58.3574322, 131, NULL, '2025-03-26 00:13:14'),
(35, 'ChIJNzVZm2bRvJUR5PuDsTgp6F8', 'Tabú Resto-Bar', 'Cnel. Dorrego 202, Monte Grande', '', '', '', -34.8176229, -58.4707109, 131, NULL, '2025-03-26 00:13:15'),
(36, 'ChIJYzty02Uyo5URvmnnIRnsl1k', 'Cafeto Bar', 'ABS, Av. Bartolomé Mitre 6298, Wilde', '', '', '', -34.7037944, -58.3173028, 131, NULL, '2025-03-26 00:13:16'),
(37, 'ChIJcbwOI-7TvJURfaz4xTI-FDo', 'Guada RESTO BAR', 'Loria 154, Lomas de Zamora', '', '', '', -34.7634222, -58.3994215, 131, NULL, '2025-03-26 00:13:17'),
(38, 'ChIJM6VDC23TvJURMmQb_WG0zvY', 'Kick Off Lomas', 'Italia 478, Lomas de Zamora', '', '', '', -34.7661903, -58.4018964, 131, NULL, '2025-03-26 00:13:19'),
(39, 'ChIJ90QIb8jTvJURLGN6TkSMrds', 'Three Monkeys Brew Bar', 'Oliden 94, Lomas de Zamora', '', '', '', -34.7656888, -58.4050362, 131, NULL, '2025-03-26 00:13:20'),
(40, 'ChIJzUo8m2bRvJUR_p8N3aZt4oM', 'Dover Bar', 'B1842AWE, Cnel. Dorrego 172, Monte Grande', '', '', '', -34.8172829, -58.4710136, 131, NULL, '2025-03-26 00:13:21'),
(41, 'ChIJt882_9bTvJURp8TzWPo0Y9o', 'Yunga Resto Bar', 'Esteban Adrogué 1151 1846, Adrogué', '', '', '', -34.7983312, -58.3909781, 131, NULL, '2025-03-26 00:13:22'),
(42, 'ChIJgeY7nX3PvJURbmwkcJcoDsc', 'Resto Bar Jhoana', 'Franklin Delano Roosevelt 787, Villa Celina', '', '', '', -34.7018051, -58.4841879, 131, NULL, '2025-03-26 00:13:23'),
(43, 'ChIJjdWS9MTMvJURNC1srHvxExI', 'Pituca Bar', 'Av. Hipólito Yrigoyen 2535, Gerli', '', '', '', -34.6865813, -58.3873987, 131, NULL, '2025-03-26 00:13:25'),
(44, 'ChIJsQAZiabOvJURHY423q5kfTE', 'Bar Astorias', 'C1439 Buenos Aires, Argentina', '', '', '', -34.6947241, -58.4678042, 131, NULL, '2025-03-26 00:13:26'),
(45, 'ChIJX6Y0cwDTvJURS3ABmRZETAM', 'Vinoteca y Bar OBRA', 'Chacabuco 160, Banfield', '', '', '', -34.7455349, -58.3925666, 131, NULL, '2025-03-26 00:13:27'),
(46, 'ChIJ5R2ukbfTvJURA7cnOKzdqkU', 'RESTO - BAR', 'Antártida Argentina 2400-2302, Llavallol', '', '', '', -34.8019516, -58.4325211, 131, NULL, '2025-03-26 00:13:28'),
(47, 'ChIJK1iGZrcso5URvdiIANxswxg', 'Bumbury Resto-Bar', 'Av. San Martín 3194, Gran Buenos Aires', '', '', '', -34.7940299, -58.3608914, 131, NULL, '2025-03-26 00:13:29'),
(48, 'ChIJUUdrdWXNvJUR4DUttfdp7Zw', 'El Bar Del Edu', 'B1826HNB HNB Remedios de Escalada Buenos Aires AR, Av. Presbitero Pedro F. Uriarte 602-700', '', '', '', -34.7345115, -58.4032618, 131, NULL, '2025-03-26 00:13:30'),
(49, 'ChIJq_D1C7rRvJURuAIGfMhKw44', 'Baco bar', 'Av. Dardo Rocha 494, B1842ABJ, Monte Grande', '', '', '', -34.8186918, -58.4750503, 131, NULL, '2025-03-26 00:13:32'),
(50, 'ChIJ2w0XIIfOvJUR7Hu5M2sjMMo', 'BAR ROCCO', 'Ingeniero Budge', '', '', '', -34.7209792, -58.4711351, 131, NULL, '2025-03-26 00:13:33'),
(51, 'ChIJFaOvhM3TvJUR9wQrEa8ef9U', 'Bar de Económicas', 'Acceso A Facultad de Ciencias Sociales, Lomas de Zamora', '', '', '', -34.7754613, -58.4590327, 131, NULL, '2025-03-26 00:13:34'),
(52, 'ChIJUXy9dwDRvJURsmk0K6Ba_o4', 'BH BAR', 'Cnel. Dorrego 212, Monte Grande', '', '', '', -34.8180541, -58.4700625, 131, NULL, '2025-03-26 00:13:35'),
(53, 'ChIJeVVFwi8to5URZNloX1XxZLA', 'New Style Bar - Pool', 'Av. Eva Perón 2491, Gran Buenos Aires', '', '', '', -34.7618515, -58.3618354, 131, NULL, '2025-03-26 00:13:36'),
(54, 'ChIJtX9FvV0to5URb_et9dl2A9s', 'KRATOS BAR', 'Salta 5, Temperley', '', '', '', -34.7616158, -58.3613724, 131, NULL, '2025-03-26 00:13:38'),
(55, 'ChIJFTCxm9zTvJURsX3dJhUsAVM', 'El Surtidor Bar', 'Blvd. Buenos Aires 998, Monte Grande', '', '', '', -34.8126650, -58.4537747, 131, NULL, '2025-03-26 00:13:39'),
(56, 'ChIJiwNHi-Qto5UR0h0dRkU2ORQ', 'La manija disco bar', 'Av. Eva Perón, Temperley', '', '', '', -34.7589899, -58.3571268, 131, NULL, '2025-03-26 00:13:40'),
(57, 'ChIJ38_k-2Uso5URJhqZtJzEO2k', 'Lo De Tato Resto-Bar', 'San Francisco Solano', '', '', '', -34.7826642, -58.3150778, 131, NULL, '2025-03-26 00:13:41'),
(58, 'ChIJqWleD-rPvJUR8QQKU0Vm1sk', 'Resto-bar', 'Juan Facundo quiroga 1380, Santa Catalina, Lomas de Zamora', '', '', '', -34.7490161, -58.4744520, 131, NULL, '2025-03-26 00:13:42'),
(59, 'ChIJ6clMqtHMvJURLHeNqpJR_Hk', 'BAR POCHO', 'Av. Teodoro Sánchez de Bustamante 460, Gerli', '', '', '', -34.6890255, -58.3799765, 131, NULL, '2025-03-26 00:13:44'),
(60, 'ChIJe72ZYNvMvJURJ5xjoOzUI-A', 'El Lusitano Bar', 'Av. Hipólito Yrigoyen 2918, Lanús', '', '', '', -34.6903986, -58.3885488, 131, NULL, '2025-03-26 00:13:45'),
(65, 'ChIJ61iNuE4zo5UR2C04LLGkNss', 'EL Bar Del Pela', 'Italia 273 305, B1870COF, Avellaneda', '', '', '', -34.6666223, -58.3644815, 131, NULL, '2025-03-26 00:13:57'),
(66, 'ChIJifq1X1PLvJUR7x8Tfq7yrQE', 'Bar Station', 'Av. Caseros 2673', '', '', '', -34.6360004, -58.4000607, 131, NULL, '2025-03-26 00:13:58'),
(67, 'ChIJRdmqDq3LvJURglzslgbjBGM', 'Esquina Vernet BAR', 'Av. Vernet 101', '', '', '', -34.6324753, -58.4270898, 131, NULL, '2025-03-26 00:13:59'),
(70, 'ChIJR-yffe3LvJURJaydl_omljc', 'Fulano Bar', 'Av. Pavón 4102', '', '', '', -34.6310652, -58.4219101, 131, NULL, '2025-03-26 00:14:03'),
(74, 'ChIJ53C9x7Y0o5URW-7jvaKfIrY', 'El Bar De Quique', 'Brandsen 800', '', '', '', -34.6366597, -58.3644545, 131, NULL, '2025-03-26 00:14:08'),
(79, 'ChIJZ-9QCrXLvJURgKAHMivNIH0', 'The Little Bar', 'Corrales Viejos 16, C1437EXB, Buenos Aires', '', '', '', -34.6372105, -58.4050225, 131, NULL, '2025-03-26 00:14:13'),
(86, 'ChIJm0hloSnKvJURfL_Y3PpbMnM', 'La Farmacia Restobar', 'Av. Directorio 2398', '', '', '', -34.6336059, -58.4605849, 131, NULL, '2025-03-26 00:14:22'),
(88, 'ChIJDeyDrrzJvJURetSG9z8CQr0', 'JLL BAR', 'Av. Juan Bautista Alberdi 5252', '', '', '', -34.6475060, -58.4978674, 131, NULL, '2025-03-26 00:14:24'),
(90, 'ChIJ8_HJRE4zo5URovy2PsEwkvg', 'Veneto Bar', 'Monseñor Piaggio 98, Avellaneda', '', '', '', -34.6640536, -58.3641521, 131, NULL, '2025-03-26 00:14:26'),
(95, 'ChIJZZSb0YjJvJURr52Kb2FKWWE', 'Cervecería-Bar DALTON', 'Av. Rivadavia 7299', '', '', '', -34.6301768, -58.4682501, 131, NULL, '2025-03-26 00:14:33'),
(96, 'ChIJq80BDY8zo5URzO8ERKY23aA', 'Herrenhaus Bar', 'Laprida 47, Avellaneda', '', '', '', -34.6636353, -58.3617572, 131, NULL, '2025-03-26 00:14:34'),
(102, 'ChIJm_7IgBTJvJUR0sSH_y5B7eE', 'Bar Las Vegas', 'Av. Eva Perón 5900', '', '', '', -34.6634271, -58.4886704, 131, NULL, '2025-03-26 00:14:41'),
(103, 'ChIJJWik6pPJvJURttwJRtheHMs', 'Kauai - Bar de pizzas', 'Manzoni 201', '', '', '', -34.6400561, -58.4990698, 131, NULL, '2025-03-26 00:14:42'),
(105, 'ChIJh7MnIRvJvJURqMGgpUR-EwU', 'Resto Bar', 'Av. Lisandro de la Torre 2375', '', '', '', -34.6622765, -58.5007501, 131, NULL, '2025-03-26 00:14:45'),
(106, 'ChIJs3Flu7U0o5URRhW8Enwtg9k', 'Bar El Estaño 1880', 'Aristóbulo del Valle 1100, C1165AGD', '', '', '', -34.6354657, -58.3681662, 131, NULL, '2025-03-26 00:14:46'),
(107, 'ChIJ87Jg1UbJvJURP-yhfoX4NPk', 'Jose L Araujo', 'Murguiondo 3564', '', '', '', -34.6714188, -58.4829165, 131, NULL, '2025-03-26 00:14:47'),
(108, 'ChIJHzNZylIzo5URcw4_fk0sz1o', 'Psiquis Bar', 'Avellaneda', '', '', '', -34.6628963, -58.3714125, 131, NULL, '2025-03-26 00:14:48'),
(109, 'ChIJ39SbHuTLvJUR0PTopa5vwso', 'Bar FANERY\'S', 'Perdriel Perdriel, Buenos Aires', '', '', '', -34.6348497, -58.3881447, 131, NULL, '2025-03-26 00:14:49'),
(111, 'ChIJcwwMZgrJvJURn7UgxO42woM', 'IL TEMPO restó & bar', 'C1407HGH, Av. Directorio 4799', '', '', '', -34.6492572, -58.4895399, 131, NULL, '2025-03-26 00:14:52'),
(114, 'ChIJ6b6B1MfJvJURrbybvaSTMvs', 'Bar Resto Chupitos Killaru', 'Av. Rivadavia 8230', '', '', '', -34.6333928, -58.4792808, 131, NULL, '2025-03-26 00:14:55'),
(115, 'ChIJxan814_JvJURZUVSSojKqLI', 'El Teatro Bar', 'Av. Rivadavia 7800', '', '', '', -34.6321896, -58.4743971, 131, NULL, '2025-03-26 00:14:57'),
(116, 'ChIJW7az27DJvJURpUMR87W3XfM', 'El Trébol Resto Bar', 'Av. Lope de Vega 14', '', '', '', -34.6372222, -58.4997222, 131, NULL, '2025-03-26 00:14:58'),
(120, 'ChIJZ_bm0xjSvJURHUbJnNjNvCY', 'Bar de Derecho', 'Lomas de Zamora', '', '', '', -34.7763804, -58.4569373, 131, NULL, '2025-03-26 00:15:03'),
(121, 'ChIJd7cJrPDLvJURvCBQuVnQky8', 'KooBAs Bar', 'Av. Corrientes 1632', '', '', '', -34.6044747, -58.3899516, 131, NULL, '2025-03-26 00:15:10'),
(122, 'ChIJ9UpyIsvKvJUR2PyjSWFU6d4', 'Barbaro Bar', 'Tres Sargentos 415', '', '', '', -34.5977699, -58.3731591, 131, NULL, '2025-03-26 00:15:11'),
(123, 'ChIJX6icjMy3vJURtLRc81pK5Bs', 'Tiempo de Sabores Villa Devoto', 'Asunción 4026', '', '', '', -34.6009676, -58.5111103, 131, NULL, '2025-03-26 00:15:12'),
(124, 'ChIJ679xNNU0o5URvKki1jzien4', 'Granados bar & rest', 'Chile 378', '', '', '', -34.6160730, -58.3713250, 131, NULL, '2025-03-26 00:15:14'),
(125, 'ChIJi6VloOO1vJURzeii4qgmagQ', 'Naranjo Bar', 'Ángel Justiniano Carranza 1059', '', '', '', -34.5878747, -58.4445900, 131, NULL, '2025-03-26 00:15:15'),
(126, 'ChIJ55Pv9_fKvJURD61HMtkp9-4', 'El Bar de Hot', 'Av. Boedo 440', '', '', '', -34.6178094, -58.4166465, 131, NULL, '2025-03-26 00:15:16'),
(127, 'ChIJAenyNIW1vJURovKGvJtWmNQ', 'Yolo Bar', 'Charcas 4800, BNT', '', '', '', -34.5809015, -58.4270498, 131, NULL, '2025-03-26 00:15:17'),
(128, 'ChIJaxpo02zLvJURjY3OobfIDDA', 'Héroes Bar', 'Junín 1287, C1113AAI, AAI', '', '', '', -34.5934409, -58.3968545, 131, NULL, '2025-03-26 00:15:18'),
(129, 'ChIJzxAaICvLvJURc3T2YFjTU28', 'Valhalla', 'C1066AAQ, Bolívar 825, Buenos Aires', '', '', '', -34.6174705, -58.3732208, 131, NULL, '2025-03-26 00:15:20'),
(130, 'ChIJDUaRYYi1vJURV11MstTj8SA', 'MADIGAN - Bar de Cervezas', 'Honduras 5015', '', '', '', -34.5884383, -58.4304432, 131, NULL, '2025-03-26 00:15:21'),
(131, 'ChIJKzhoKkrKvJURnC2FhFF0GFM', 'BRONX BAR', 'Av. Directorio 728', '', '', '', -34.6287099, -58.4375297, 131, NULL, '2025-03-26 00:15:22'),
(132, 'ChIJNfrDUbK1vJURw1UHBuniUAs', 'Lutero Bar', 'Av. Jorge Newbery 3801', '', '', '', -34.5859710, -58.4500602, 131, NULL, '2025-03-26 00:15:23'),
(133, 'ChIJyexHSHnKvJUR995OdowcXQ0', 'Clot', '1414, Honduras 4308, Buenos Aires', '', '', '', -34.5934753, -58.4237564, 131, NULL, '2025-03-26 00:15:24'),
(134, 'ChIJV5UyEyrLvJURXeDKCsWkbKw', 'La Puerta Roja', 'Chacabuco 733', '', '', '', -34.6166861, -58.3760191, 131, NULL, '2025-03-26 00:15:25'),
(135, 'ChIJ0-KUQojLvJUR6sq_V885v_g', '1175 Bar and Lounge', 'Uruguay 1175', '', '', '', -34.5950243, -58.3871539, 131, NULL, '2025-03-26 00:15:27'),
(136, 'ChIJKTicDX01o5URkIOu991ylkA', 'Puente Gran Bar', 'Av. Alicia Moreau de Justo 876', '', '', '', -34.6079131, -58.3661945, 131, NULL, '2025-03-26 00:15:28'),
(137, 'ChIJGXMI1Yi1vJURdRYkUv_rTnc', 'Isabel', 'Uriarte 1664', '', '', '', -34.5869593, -58.4315174, 131, NULL, '2025-03-26 00:15:29'),
(138, 'ChIJY6MlH_y1vJURq6eSHWWFwJ0', 'Strummer Bar', 'Godoy Cruz 1631', '', '', '', -34.5879392, -58.4343986, 131, NULL, '2025-03-26 00:15:30'),
(139, 'ChIJdQu60jLLvJURdbXjzzfNwJY', 'Nápoles', 'C1152AAA, Av. Caseros 449', '', '', '', -34.6265607, -58.3717379, 131, NULL, '2025-03-26 00:15:31'),
(140, 'ChIJ2XS_sozLvJURuU8DHFOT_fU', 'El King Bar Pool & Ribs', 'Río de Janeiro 389', '', '', '', -34.6110291, -58.4301796, 131, NULL, '2025-03-26 00:15:33'),
(141, 'ChIJdXo-paE1o5URFjLsLW9CEH0', 'Alberto\'s Lobby Bar', 'Blvd. Macacha Guemes 351', '', '', '', -34.6057212, -58.3636263, 131, NULL, '2025-03-26 00:15:34'),
(142, 'ChIJFbe1sRHLvJURHALf3Wxi6g8', 'Alambique Bar', 'Honduras 4413', '', '', '', -34.5926288, -58.4244005, 131, NULL, '2025-03-26 00:15:35'),
(143, 'ChIJcQQc0LfKvJURT7AcSbqMf8U', 'Bar Calixto', 'Marcelo Torcuato de Alvear 930', '', '', '', -34.5966286, -58.3803103, 131, NULL, '2025-03-26 00:15:36'),
(144, 'ChIJpYj70oK1vJUR-MRT_IWk4u4', 'Soler Street Bar', 'Soler 5699', '', '', '', -34.5800702, -58.4334405, 131, NULL, '2025-03-26 00:15:37'),
(145, 'ChIJQziPLKHLvJURCPUcTfFiUcQ', 'Lady Madrid Bar de Tapas', 'Azcuénaga 1222', '', '', '', -34.5939175, -58.3995697, 131, NULL, '2025-03-26 00:15:39'),
(146, 'ChIJscJQApK1vJURZM9i8TmoWC4', 'Thames Bar', 'Thames, Pje. Soria 1532, Soho', '', '', '', -34.5883052, -58.4318379, 131, NULL, '2025-03-26 00:15:40'),
(147, 'ChIJFfMiAlPLvJURAxMXHKfulQA', 'A.K.A BAR', 'Junín 731', '', '', '', -34.6006250, -58.3969229, 131, NULL, '2025-03-26 00:15:41'),
(148, 'ChIJP2k4UY63vJURSIg3WkT8MDg', 'Brava Bar Urquiza', 'Mendoza 5234', '', '', '', -34.5780105, -58.4849448, 131, NULL, '2025-03-26 00:15:42'),
(149, 'ChIJY7BIXb7LvJURMfrngJLn-90', 'La Calle Bar 2', 'Gurruchaga 732', '', '', '', -34.5953511, -58.4388578, 131, NULL, '2025-03-26 00:15:43'),
(150, 'ChIJmcYV6inLvJURsGYKxCDsXeo', 'Bar La Esquinita', 'Av. Independencia 897, AAI', '', '', '', -34.6173951, -58.3786416, 131, NULL, '2025-03-26 00:15:44'),
(151, 'ChIJewJymI21vJURH1zfsNejjdM', 'Moon Palermo Hollywood Bar', 'C1414CHW, Fitz Roy 1645', '', '', '', -34.5846201, -58.4367191, 131, NULL, '2025-03-26 00:15:46'),
(152, 'ChIJq6r6z4LKvJURgSKThKdq7B4', 'CUENCA BAR', 'Austria 2093', '', '', '', -34.5881985, -58.4041069, 131, NULL, '2025-03-26 00:15:47'),
(153, 'ChIJ2WgNhJO1vJUR1ND56WUwX20', 'M Street Bar', 'C1414BWK, Nicaragua 5935', '', '', '', -34.5788651, -58.4369183, 131, NULL, '2025-03-26 00:15:48'),
(154, 'ChIJA_7n74LKvJURMn43KU3AmE0', 'Ferdinando N Bar', 'Juncal 3052, AYN', '', '', '', -34.5870630, -58.4078061, 131, NULL, '2025-03-26 00:15:49'),
(155, 'ChIJue6R-qI1o5URnhdLOlA5L9U', 'The Library Lounge Faena Bar', 'Martha Salotti 445', '', '', '', -34.6135436, -58.3618985, 131, NULL, '2025-03-26 00:15:50'),
(156, 'ChIJ0UW9TN61vJURrvwVRMDkT-Q', '8 Esquinas Bar', 'Av. Forest 1186', '', '', '', -34.5785236, -58.4602261, 131, NULL, '2025-03-26 00:15:52'),
(157, 'ChIJZybHQYi1vJURNRtCIq3nohY', '70 30 Bar Palermo', 'Gurruchaga 1493', '', '', '', -34.5901597, -58.4303023, 131, NULL, '2025-03-26 00:15:53'),
(158, 'ChIJ6dyRD7vKvJURGPaSE7oTNuY', 'Presidente Bar', 'Av. Pres. Manuel Quintana 188', '', '', '', -34.5911097, -58.3868102, 131, NULL, '2025-03-26 00:15:54'),
(159, 'ChIJ5Z0JC0_LvJURV2Z8P_-vDN0', 'Veruca Bar', 'Chile 471', '', '', '', -34.6159366, -58.3726757, 131, NULL, '2025-03-26 00:15:55'),
(160, 'ChIJy4qUv4q1vJUR8rayMlrFSIg', 'Bar 878', 'Thames 878', '', '', '', -34.5928304, -58.4391003, 131, NULL, '2025-03-26 00:15:56'),
(161, 'ChIJ232tNje2vJURzzCMGytwW18', 'Orange Bar', 'Av. S. Martín 5885', '', '', '', -34.5958982, -58.4990689, 131, NULL, '2025-03-26 00:15:58'),
(162, 'ChIJDctMZL_LvJURSLqO8WjB-Ak', 'Bar Barril', 'Vera 715, C1414AOO', '', '', '', -34.5970554, -58.4394159, 131, NULL, '2025-03-26 00:15:59'),
(163, 'ChIJoxyptJO1vJURkS0Bx7DJlao', 'CANTI BAR', 'Bonpland 882', '', '', '', -34.5897282, -58.4453948, 131, NULL, '2025-03-26 00:16:00'),
(164, 'ChIJqbe7jP-1vJURMURFzrdjtms', 'Rabia Bar', 'Costa Rica 4901', '', '', '', -34.5866064, -58.4291574, 131, NULL, '2025-03-26 00:16:01'),
(165, 'ChIJYSt_UDe1vJURFYPuPfS4CZ8', 'Bar', 'Av. Cnel. Niceto Vega 4984', '', '', '', -34.5821444, -58.4208643, 131, NULL, '2025-03-26 00:16:02'),
(166, 'ChIJg6a-RUvLvJURfrQDPa3RaXE', 'SEVEN DAYS- Cocina Bar', 'Marcelo Torcuato de Alvear 944', '', '', '', -34.5966356, -58.3805017, 131, NULL, '2025-03-26 00:16:04'),
(167, 'ChIJfdluDBvLvJUR9CWIv_py3MU', 'Cancerbero Bar', 'Lavalleja 1325', '', '', '', -34.5947223, -58.4250064, 131, NULL, '2025-03-26 00:16:05'),
(168, 'ChIJqSfayirLvJUR5taMpII6fcY', 'Bar Seddon', 'Defensa 695', '', '', '', -34.6159550, -58.3718758, 131, NULL, '2025-03-26 00:16:06'),
(170, 'ChIJC8HlWma1vJURYD-XVkzla2k', 'Fusion beer bar', 'Malabia 1885, DMK', '', '', '', -34.5891799, -58.4244735, 131, NULL, '2025-03-26 00:16:08'),
(171, 'ChIJsX5Pzj3LvJURQdgWBwpPg70', 'Amazonica Bar', 'Vicente López 2180', '', '', '', -34.5881151, -58.3950948, 131, NULL, '2025-03-26 00:16:09'),
(172, 'ChIJ2SUwPIm1vJURMEwpGKcTM0w', 'Soria Bar', 'Gorriti 5151', '', '', '', -34.5882289, -58.4324471, 131, NULL, '2025-03-26 00:16:11'),
(173, 'ChIJZVzGd3nKvJURM3XBRh-oq3U', 'Dársena', 'José A. Cabrera 4354', '', '', '', -34.5946808, -58.4260112, 131, NULL, '2025-03-26 00:16:12'),
(174, 'ChIJETQ-T0HKvJURSeCbV2PJB5A', 'The Oldest Bar Caballito', 'Juan B. Ambrosetti 31', '', '', '', -34.6172147, -58.4354279, 131, NULL, '2025-03-26 00:16:13'),
(175, 'ChIJR7RGwjPJvJUR0JqEcbEORQ0', 'SOBRE EL BAR DE LA ESQUINA', 'La esquina de Condarco y, Dr. Luis Beláustegui, Cdad. De BsAs', '', '', '', -34.6150730, -58.4748613, 131, NULL, '2025-03-26 00:16:14'),
(176, 'ChIJ3YgML7vKvJURNO236Vqldq4', 'Oak Bar - Palacio Duhau Park Hyatt Buenos Aires', 'Av. Alvear 1661', '', '', '', -34.5893598, -58.3862536, 131, NULL, '2025-03-26 00:16:15'),
(177, 'ChIJ2cxUAjfLvJUR3DBwuQj26xg', 'Dorsia Bar', 'Junín 1789', '', '', '', -34.5886498, -58.3922095, 131, NULL, '2025-03-26 00:16:17'),
(178, 'ChIJmZTTGHzLvJURSRDjH9Y09bM', 'NÓMADE BAR', 'Junín 1171, AAG', '', '', '', -34.5947729, -58.3970819, 131, NULL, '2025-03-26 00:16:18'),
(179, 'ChIJqToRnU-1vJURwzbvZW84QXY', 'Paquito bar', 'Thames 1999', '', '', '', -34.5854735, -58.4271157, 131, NULL, '2025-03-26 00:16:19'),
(180, 'ChIJydj2yc_LvJURsHbhi5pnaio', 'Anasagasti Bar & Restaurant', 'Pje. Anasagasti 2067', '', '', '', -34.5888307, -58.4113614, 131, NULL, '2025-03-26 00:16:20'),
(182, 'ChIJSR26Kua2vJUREjutsHEgStc', 'JOE BAR BSAS', 'Av. Dr. Ricardo Balbín 4699', '', '', '', -34.5534538, -58.4972741, 131, NULL, '2025-03-26 00:16:29'),
(183, 'ChIJgYcRkH23vJURwFGCOsN-_Zs', 'Piénsate Bravo - Cocktail Garden - Bar', 'Cap. Gral. Ramón Freire 2252', '', '', '', -34.5652243, -58.4657291, 131, NULL, '2025-03-26 00:16:30'),
(188, 'ChIJobZ2Os21vJURgpKVcKNVom4', 'Puerta Uno Bar', 'Av. Juramento 1667', '', '', '', -34.5577361, -58.4496784, 131, NULL, '2025-03-26 00:16:36'),
(190, 'ChIJVS7QQZ22vJUR0jOb_Dy2Rx0', 'Houdini Public Bar', 'Manuela Pedraza 2179', '', '', '', -34.5500346, -58.4642078, 131, NULL, '2025-03-26 00:16:38'),
(199, 'ChIJ9Z1MnsO1vJURp-GOs8SUmKQ', 'Ruda Bar', 'Crámer 824', '', '', '', -34.5730376, -58.4486106, 131, NULL, '2025-03-26 00:16:49'),
(201, 'ChIJW0bRTJe2vJUR44UICCE14eU', 'Taki Corner Bar', 'Av. García del Río 3003, C1429DEG', '', '', '', -34.5494602, -58.4754668, 131, NULL, '2025-03-26 00:16:51'),
(204, 'ChIJE-Sp_tC3vJURNmRc_XQkhEM', 'Bar Collage', 'Av. Francisco Beiró 4749', '', '', '', -34.6091774, -58.5174925, 131, NULL, '2025-03-26 00:16:55'),
(206, 'ChIJsVzS6Ha1vJURHs17rW8acBY', '70 30 Bar Núñez', 'Arribeños 3486', '', '', '', -34.5461324, -58.4599082, 131, NULL, '2025-03-26 00:16:57'),
(225, 'ChIJNWqHkvm3vJURPnJHL7NryCA', 'Orange Bar', 'Av. Triunvirato 5184', '', '', '', -34.5712589, -58.4904921, 131, NULL, '2025-03-26 00:17:20'),
(240, 'ChIJOacYP4m1vJURxBO4wQwbO6Q', 'Rey de Copas', 'Gorriti 5176', '', '', '', -34.5883593, -58.4329437, 131, NULL, '2025-03-26 00:17:38'),
(248, 'ChIJH-SyB9_UvJURfZDz4LZ904w', 'ROMA bar-pool', 'Boulogne Sur Mer 1580, Longchamps', '', '', '', -34.8571011, -58.3914222, 131, NULL, '2025-03-26 00:17:54'),
(260, 'ChIJyc98fF8po5URx5lUgjjW5V8', 'Rojo Bar', 'Batalla de Chacabuco 101, Florencio Varela', '', '', '', -34.8037948, -58.2805020, 131, NULL, '2025-03-26 00:18:09'),
(266, 'ChIJDyTLgQnNvJURJhvwYuJQAFw', 'Crash Bar', '1826, Remedios de Escalada', '', '', '', -34.7317351, -58.3965178, 131, NULL, '2025-03-26 00:18:16'),
(269, 'ChIJda1UdlUpo5URdgll9Ui1bs8', 'Bar y Pizzeria de Carlos N Morillo', 'Victorino de la Pl. 1311, Florencio Varela', '', '', '', -34.7894338, -58.2795762, 131, NULL, '2025-03-26 00:18:20'),
(281, 'ChIJMbn0t08vo5URcq5d0iMUlv4', 'Mamba - Bar y Cervecería', 'Av. Gral. José de San Martín 2583, Florencio Varela', '', '', '', -34.8025424, -58.2787275, 131, NULL, '2025-03-26 00:18:40'),
(286, 'ChIJpXKtJwAto5URLxPT1OPUe3o', 'Bar Pool Topolandia.', 'Av. Eva Perón 1526, Quilmes Oeste', '', '', '', -34.7534371, -58.3253063, 131, NULL, '2025-03-26 00:18:47'),
(290, 'ChIJV5h41srNvJURM_NFxOas4kE', 'Que Burger Bar', 'Ricardo Palma 890 B1821FLR, Ingeniero Budge', '', '', '', -34.7308818, -58.4513558, 131, NULL, '2025-03-26 00:18:52'),
(294, 'ChIJufQOtdHTvJURvozJFeCy9pQ', 'El Bufet Bar', 'Samuel Miguel Spiro 1093, Adrogué', '', '', '', -34.7987440, -58.3915166, 131, NULL, '2025-03-26 00:18:56'),
(298, 'ChIJ7UeQhEnVvJURDoGm3XoWUJk', 'Bolder resto bar 2', 'Av. Hipólito Yrigoyen 19975, Glew', '', '', '', -34.8765349, -58.3899900, 131, NULL, '2025-03-26 00:19:01'),
(299, 'ChIJ4aGF0k3TvJURRbjB4Ci_URY', 'Bouchardito Bar', 'Peña, Gral. Arenales &, Banfield', '', '', '', -34.7512003, -58.3882527, 131, NULL, '2025-03-26 00:19:03');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=301;

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
