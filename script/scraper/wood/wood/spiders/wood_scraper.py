#-*-coding:utf8-*-
'''
Scraper for wood database

Copyright 2014 Joe Nudell
'''

from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor
from scrapy.selector import Selector

from wood.items import WoodItem

import re

url = 'http://www.wood-database.com/wood-identification/'


# generic helpers
def get_first_text(lst):
    return ''.join(lst.pop(0).xpath('./text()').extract())

def strip(t):
    return t.replace(u'\u00A0', ' ').strip('*').strip('~').strip()

def break_up(l):
    return [strip(t) for t in l.split(',')]

def clean_number(t):
    return float(re.sub(r'[^\d\.]', '', strip(t)).rstrip('.'))

def clean_number_range(t):
    return re.sub(r'[^\d\s*\-\s*\.]', '', t)

def process_range(t):
    return [clean_number(n) for n in clean_number_range(t).split('-')]

def read_complex_number_line(text, lim=None):
    text = text or ''
    match = re.match(r'([\d,\.]+)\s+.*\(([\d,\.]+)\s+.*\)', text)
    if match is None:
        return [None] * lim if lim is not None else []
    return [clean_number(n) for n in match.groups()]

def read_comma_number_line(text, lim=None):
    text = text or ''
    if text.startswith('No data'):
        return [None] * lim if lim is not None else []
    try:
        l = [clean_number(n) for n in text.split(',')]
    except ValueError:
        l = text
    while len(l) < lim: l.append(None)
    return l

def make_dict(blocks):
    texts = [block.xpath('.//text()').extract() for block in blocks]
    ps = [
        filter(lambda x: len(x) > 0, [t.strip() for t in tl])
        for tl
        in texts
    ]
    return dict([
        [
            p[0].strip(':'),
            ' '.join(p[1:])
        ]
        for p
        in ps
    ])

def quote_dict(sel):
    bqs = sel.css('.post-content').xpath('.//blockquote')
    return make_dict(bqs)

def info_dict(sel):
    td = sel.css('.post-content').xpath('.//table//td')[1]
    paragraphs = td.xpath('.//p')
    d = make_dict(paragraphs)
    cname = 'Common Name(s)'
    # ugly patch for getting common name which may not be in a <p>
    if cname not in d:
        d[cname] = sel.css('title')\
                      .xpath('./text()')\
                      .extract()[0]\
                      .split(' | ')[0]
    return d

def safe_get(d, key):
    return d[key] if key in d else None


# formatters
def _seal_str(s):
    return s.replace('\xa0', ' ').strip()

def _seal_unicode(u):
    return u.replace(u'\u0a00', ' ')

def seal(m):
    if type(m) is str:
        return _seal_str(m)
    elif type(m) is unicode:
        return _seal_unicode(m)
    elif type(m) is list:
        return [seal(p) for p in m]
    else:
        return m

def get_wood_type(url):
    tp = re.search(r'lumber\-identification\/(.+?)s?\/', url)
    if tp is None:
        return None
    g = tp.group(1)
    return g


# specific cutters
def sci_name(text):
    text = text or ''
    species = re.split(r' spp\s*\.\s*\(', text)
    if len(species) > 1:
        # format descriptions using spp.
        genus = species[0]
        spp = [strip(s) for s in species[1][:-1].split(',')]
        species = [
            s.replace(genus[:1].upper() + '.', genus).replace('and ', '')
            for s in spp
        ]
    return species

def read_size(text):
    text = text or ''
    if text.startswith('No data'):
        return [None] * 4
    l = [process_range(item) for dim in text.split(',')
        for item in dim.split('(')]
    while len(l) < 4: l.append(None)
    return l


def read_janka(text):
    if text.startswith('No data'):
        return [None] * 2
    return [clean_number(n) for n in text.split('(')]


# spider
class WoodSpider(CrawlSpider):
    name = 'wood'
    allowed_domains = ['www.wood-database.com']
    start_urls = [url]
    rules = [Rule(SgmlLinkExtractor(allow=['/lumber-identification/']),
        'parse_wood')]

    def parse_wood(self, response):
        sel = Selector(response)
        wood = WoodItem()

        # extract basic info stuff from first table
        info = info_dict(sel)

        # bail if no basic info is available - they do this for types of wood
        # that are popular cosmetic types of other types of wood (for example,
        # rainbow poplar for poplar)
        if not len(info.keys()):
            return

        get = lambda k: safe_get(info, k)

        # names
        wood['common_name'] = seal(break_up(get('Common Name(s)')))
        wood['scientific_name'] = seal(sci_name(get('Scientific Name')))
        wood['distribution'] = seal(get('Distribution'))

        # tree sizes
        tree_size = read_size(get('Tree Size'))
        wood['tree_height_imperial'] = seal(tree_size[0])
        wood['tree_height_metric'] = seal(tree_size[1])
        wood['tree_diameter_imperial'] = seal(tree_size[2])
        wood['tree_diameter_metric'] = seal(tree_size[3])

        # dried weight
        weight = read_complex_number_line(get('Average Dried Weight'), 2)
        wood['average_dried_weight_imperial'] = seal(weight[0])
        wood['average_dried_weight_metric'] = seal(weight[1])

        # gravity
        gr_text = get('Specific Gravity (Basic, 12% MC)')
        gravity = read_comma_number_line(gr_text, 2)
        wood['specific_gravity_basic'] = seal(gravity[0])
        wood['speicifc_gravity_12pct'] = seal(gravity[1])

        # hardness
        janka = read_janka(get('Janka Hardness'))
        wood['janka_hardness_imperial'] = seal(janka[0])
        wood['janka_hardness_metric'] = seal(janka[1])

        # moduli
        rupture = read_complex_number_line(get('Modulus of Rupture'), 2)
        wood['modulus_of_rupture_imperial'] = seal(rupture[0])
        wood['modulus_of_rupture_metric'] = seal(rupture[1])

        elastic_rupture = read_complex_number_line(get('Elastic Modulus'), 2)
        wood['elastic_modulus_imperial'] = seal(elastic_rupture[0])
        wood['elastic_modulus_metric'] = seal(elastic_rupture[1])

        # strength
        strength = read_complex_number_line(get('Crushing Strength'), 2)
        wood['crushing_strength_imperial'] = seal(strength[0])
        wood['crushing_strength_metric'] = seal(strength[1])

        # shrinkage
        shrinkage = read_comma_number_line(get('Shrinkage'), 4)
        wood['shrinkage_radial'] = seal(shrinkage[0])
        wood['shrinkage_tangential'] = seal(shrinkage[1])
        wood['shrinkage_volumetric'] = seal(shrinkage[2])
        wood['shrinkage_tr_ratio'] = seal(shrinkage[3])


        # extract text stuff
        blockquotes = quote_dict(sel)
        get = lambda m: blockquotes[m] if m in blockquotes else None

        wood['text_color'] = seal(get('Color/Appearance'))
        wood['text_grain'] = seal(get('Grain/Texture'))
        wood['text_endgrain'] = seal(get('Endgrain'))
        wood['text_rot'] = seal(get('Rot Resistance'))
        wood['text_workability'] = seal(get('Workability'))
        wood['text_odor'] = seal(get('Odor'))
        wood['text_toxicity'] = seal(get('Allergies/Toxicity'))
        wood['text_price'] = seal(get('Pricing/Availability'))
        wood['text_sustainability'] = seal(get('Sustainability'))
        wood['text_uses'] = seal(get('Common Uses'))
        wood['text_comments'] = seal(get('Comments'))
        wood['text_related'] = seal(get('Related Species'))

        # image urls
        wood['url_pics'] = sel.css('.post-content img.size-thumbnail')\
                      .xpath('.//@src')\
                      .extract()

        # parse url
        wood['url'] = response.url
        wood['wood_type'] = get_wood_type(response.url)

        return wood

