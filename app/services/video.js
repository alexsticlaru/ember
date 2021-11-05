import Service from '@ember/service';

export default class VideoService extends Service {

  //check if a url is a video url
  isVideo (url) {
    return (
			url.includes('https://www.youtube.com') ||
			url.includes('https://youtu.be') ||
			url.includes('https://www.dailymotion.com') ||
			url.includes('vimeo.com')
		);
  }

  //convert a media url to a video url
  convertMediaUrlToVideoEmbed (url) {
    let urlResult = url.split('&')[0];
    return urlResult.replace("watch?v=", "embed/")
              .replace("youtu.be/", "www.youtube.com/embed/")
              .replace("https://www.dailymotion.com/video", "https://www.dailymotion.com/embed/video")
              .replace("vimeo.com", "player.vimeo.com/video");
  }

}
