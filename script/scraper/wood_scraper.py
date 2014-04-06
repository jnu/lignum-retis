#-*-coding:utf8-*-
'''
Scraper for wood database

Copyright 2014 Joe Nudell
'''

from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.selector import selector

from wood_item import WoodItem

def get_first_text(lst):
    return lst.pop(0).xpath('.//text()')

def break_up(l):
    return [t.strip() for t in l.split(',')]

tree_size

class WoodSpider(CrawlSpider):
    name = 'wood_spider'
    allowed_domains = ['www.wood-database.com']
    start_urls = ['http://www.wood-database.com/lumber-identification/hardwoods/abura/']
    rules = [Rule(SgmlLinkExtractor(allow=['/lumber-identification/']),
        'parse_wood')]

    def parse_wood(self, response):
        sel = Selector(response)
        wood = WoodItem()

        post = sel.xpath('//*[@class="post-content"]')

        blockquotes = post.xpath('.//blockquote')
        tables = post.xpath('.//table')

        # bail if post is not full
        if len(blockquotes) != 12:
            return

        # extract basic info stuff from first table
        info = tables.xpath('.//td')[1].xpath('.//p')


        common_name = break_up(get_first_text(info))
        scientific_name = get_first_text(info)
        distribution = get_first_text(info)

        tree_size = read_size(get_first_text(info))
        tree_height_imperial = tree_size[0]
        tree_height_metric = tree_size[1]
        tree_diameter_imperial = tree_size[2]
        tree_diameter_metric = tree_size[3]

        average_dried_weight_imperial = get_first_text(info)
        average_dried_weight_metric = get_first_text(info)
        specific_gravity_basic = get_first_text(info)
        speicifc_gravity_12pct = get_first_text(info)
        janka_hardness_imperial = get_first_text(info)
        janka_hardness_metric = get_first_text(info)
        modulus_of_rupture_imperial = get_first_text(info)
        modulus_of_rupture_metric = get_first_text(info)
        elastic_modulus_imperial = get_first_text(info)
        elastic_modulus_metric = get_first_text(info)
        crushing_strength_imperial = get_first_text(info)
        crushing_strength_metric = get_first_text(info)
        shrinkage_radial = get_first_text(info)
        shrinkage_tangential = get_first_text(info)
        shrinkage_volumetric = get_first_text(info)
        shrinkage_tr_ratio = get_first_text(info)


        # extract text stuff
        text_color = get_first_text(blockquotes)
        text_grain = get_first_text(blockquotes)
        text_endgrain = get_first_text(blockquotes)
        text_rot = get_first_text(blockquotes)
        text_workability = get_first_text(blockquotes)
        text_odor = get_first_text(blockquotes)
        text_toxicity = get_first_text(blockquotes)
        text_price = get_first_text(blockquotes)
        text_sustainability = get_first_text(blockquotes)
        text_uses = get_first_text(blockquotes)
        text_comments = get_first_text(blockquotes)
        text_related = get_first_text(blockquotes)



