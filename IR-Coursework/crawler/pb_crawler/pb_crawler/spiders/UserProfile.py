import scrapy

class UserProfile(scrapy.Spider):
  name = "profiles"

  start_urls = [
  'https://pureportal.coventry.ac.uk/en/organisations/coventry-university/persons/'
  ]

  def parse(self,response):
    data = {}
    data['profiles']= []

    profiles = response.css('.rendering.rendering_person.rendering_short.rendering_person_short')
    
    # looping through each person's detail
    for detail in profiles:
      yield {
        'author': detail.css('span::text').get(),
        'url': detail.css('a ::attr(href)').get()
      }
    
    # Hitting the next page and invoking self crawling logic
    next_page = response.css('.next a ::attr(href)').get()
    if next_page is not None:
      next_page = response.urljoin(next_page)
      yield scrapy.Request(next_page, callback = self.parse)