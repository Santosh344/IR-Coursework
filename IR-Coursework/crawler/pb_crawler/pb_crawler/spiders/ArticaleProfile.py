import scrapy
import json
import uuid

class ArticleSpider(scrapy.Spider):
  name = "artoc"
  details = {}
  with open('details.json') as json_file:
    details = json.load(json_file)  
  start_urls=[]

  for detail in details:
    start_urls.append(detail['url']+'/pbls/')

  def parse(self,response):
    pbls = response.css('.result-container')
    for pbl in pbls:
      concepts = pbl.css('.concept-wrapper')
      
      cat = []
      for concept in concepts:
        categories.append(concept.css('.concept::text').get())
        
      yield {
        "_id": uuid.uuidv4(),
        'author': response.css('.person-details h1::text').get(),
        'title': pbl.css('h3 span::text').get(),
        'link': pbl.css('h3 a ::attr(href)').get(),
        'date': pbl.css('.date::text').get(),
        'concepts': categories
      }
