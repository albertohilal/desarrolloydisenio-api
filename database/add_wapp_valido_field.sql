-- Migration script to add wapp_valido field to ll_lugares table
-- This field will be used to filter places for shipping/envios functionality

USE iunaorg_doli184;

-- Add wapp_valido field to ll_lugares table
-- 0 = not valid for WhatsApp, 1 = valid for WhatsApp
ALTER TABLE `ll_lugares` 
ADD COLUMN `wapp_valido` TINYINT(1) DEFAULT 0 COMMENT 'WhatsApp validation: 0=invalid, 1=valid';

-- Update existing records to have a default value (for this example, set random values for testing)
-- In production, this should be based on actual business logic
UPDATE `ll_lugares` SET `wapp_valido` = 0 WHERE `id` IS NOT NULL;

-- Optionally, set some records to 1 for testing purposes
-- This would typically be done based on business rules like having a valid phone number
UPDATE `ll_lugares` SET `wapp_valido` = 1 WHERE `telefono` IS NOT NULL AND `telefono` != '';