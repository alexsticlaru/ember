import Service from '@ember/service';

export default class MetaService extends Service {
    addMetaTags(fields) {
        let tags = [];
    
        if (fields.description) {
          tags.push({
            property: 'description',
            content: fields.description
          });
          tags.push({
            property: 'og:description',
            content: fields.description
          });
        }
    
        if (fields.image) {
          tags.push({
            property: 'image',
            content: fields.image
          });
          tags.push({
            property: 'og:image',
            content: fields.image
          });
          tags.push({
            property: 'og:image:width',
            content: 600,
          });
          tags.push({
            property: 'og:image:height',
            content: 315,
          });
        }
    
        if (fields.statusCode) {
          tags.push({
            property: 'prerender:status-code',
            content: fields.statusCode
          });
        }
    
        if (fields.header) {
          tags.push({
            property: 'prerender:header',
            content: fields.header
          });
        }
    
        document.title = fields.title || ENV.APP.DEFAULT_PAGE_TITLE;
    
        $('#meta-start').nextUntil('#meta-end').remove();
        for (let i = 0; i < tags.length; i++) {
          $('#meta-start').after($('<meta>', tags[i]));
        }
      }
}
