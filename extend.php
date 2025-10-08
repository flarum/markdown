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

            // Add custom BBCode-style tag for links with target="_blank"
            // This allows the syntax: [text](url){:target="_blank"}
            $tag = $config->tags->add('LINK_BLANK');
            $tag->attributes->add('url')->filterChain->append('#url');
            $tag->template = '<a href="{@url}" target="_blank" rel="noopener noreferrer"><xsl:apply-templates/></a>';

            // Add a custom regexp to parse [text](url){:target="_blank"}
            $config->BBCodes->addCustom(
                '[text={URL;useContent}]{:target="_blank"}',
                '<LINK_BLANK url={URL}>{text}</LINK_BLANK>'
            );
        })
        ->parse(function ($parser, $context, $text) {
            // Pre-process text to convert [text](url){:target="_blank"} to BBCode format
            $text = preg_replace(
                '/\[([^\]]+)\]\(([^)]+)\)\{:target="_blank"\}/',
                '[$1=$2]{:target="_blank"}',
                $text
            );

            return $text;
        }),

    new Extend\Locales(__DIR__.'/locale'),
];
