<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

use Flarum\Extend;
use s9e\TextFormatter\Configurator;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/common.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/common.less'),

    (new Extend\Formatter)
        ->configure(function (Configurator $config) {
            $config->Litedown;

            // Overwrite the default inline spoiler so that it is compatible
            // with more styling for children in an external stylesheet.
            $config->tags['ispoiler']->template = '<span class="spoiler" data-s9e-livepreview-ignore-attrs="class" onclick="removeAttribute(\'class\')"><xsl:apply-templates/></span>';
            
            // Add support for {:target="_blank"} in links
            // This will match [text](url){:target="_blank"}
            if (isset($config->tags['URL'])) {
                // Modify the URL tag template to support target attribute
                $config->tags['URL']->template = '<a href="{@url}"><xsl:if test="@target"><xsl:attribute name="target"><xsl:value-of select="@target"/></xsl:attribute></xsl:if><xsl:apply-templates/></a>';
                
                // Add the target attribute to the tag
                $config->tags['URL']->attributes->add('target')->filterChain->append('#identifier');
            }
        })
        ->render(function ($renderer, $context, $xml, $request) {
            // Post-process the XML to extract {:target="_blank"} attributes
            $xml = preg_replace_callback(
                '/<URL url="([^"]*)">(.*?)\{:target="_blank"\}<\/URL>/',
                function ($matches) {
                    return '<URL url="' . $matches[1] . '" target="_blank">' . $matches[2] . '</URL>';
                },
                $xml
            );
            
            return $xml;
        }),

    new Extend\Locales(__DIR__.'/locale'),
];
