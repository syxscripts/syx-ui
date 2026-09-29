fx_version 'cerulean'
game 'gta5'

author 'Syntax Scripts'
description 'Shared purple UI design system used by all Syntax Scripts resources'
version '1.0.0'

-- This resource ships no client/server logic - it only exposes shared
-- CSS/JS that other resources load via nui://syx-ui/html/...
-- Add `dependency 'syx-ui'` to any resource's fxmanifest that uses it,
-- and make sure syx-ui is started ABOVE it in server.cfg.

files {
    'html/theme.css',
    'html/ui.js',
}
