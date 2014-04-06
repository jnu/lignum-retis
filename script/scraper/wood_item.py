#-*-coding:utf8-*-
'''
Schema for the wood database

Copyright 2014 Joe Nudell
'''

from scrapy.item import item, field

class WoodItem(Item):
    common_name = Field()
    scientific_name = Field()
    distribution = Field()
    tree_height_imperial = Field()
    tree_height_metric = Field()
    tree_diameter_imperial = Field()
    tree_diameter_metric = Field()
    average_dried_weight_imperial = Field()
    average_dried_weight_metric = Field()
    specific_gravity_basic = Field()
    speicifc_gravity_12pct = Field()
    janka_hardness_imperial = Field()
    janka_hardness_metric = Field()
    modulus_of_rupture_imperial = Field()
    modulus_of_rupture_metric = Field()
    elastic_modulus_imperial = Field()
    elastic_modulus_metric = Field()
    crushing_strength_imperial = Field()
    crushing_strength_metric = Field()
    shrinkage_radial = Field()
    shrinkage_tangential = Field()
    shrinkage_volumetric = Field()
    shrinkage_tr_ratio = Field()

    text_color = Field()
    text_grain = Field()
    text_endgrain = Field()
    text_rot = Field()
    text_workability = Field()
    text_odor = Field()
    text_toxicity = Field()
    text_price = Field()
    text_sustainability = Field()
    text_uses = Field()
    text_comments = Field()
    text_related = Field()

    bin_pics = Field()
