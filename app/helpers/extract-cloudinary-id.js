import { helper } from '@ember/component/helper';

export default helper(function extractCloudinaryId(params/*, hash*/) {
  const urlLength = params[0].content.split("src=")[1].split("style")[0].length;
  const url = params[0].content.split("src=")[1].split("style")[0].substring(1, urlLength-1);
  const cloudLocation= url.split("/upload/")[1];
  return cloudLocation.substring(0, cloudLocation.length-1);
});
