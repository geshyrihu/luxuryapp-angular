//Archivo necesario para usar ONEsIGNAL
interface Window {
  OneSignal: any;
}

declare module "photoswipe/dist/photoswipe-ui-default" {
  const PhotoSwipeUI_Default: new (
    pswp: PhotoSwipe<PhotoSwipe.Options>,
    framework: PhotoSwipe.UIFramework,
  ) => PhotoSwipe.UI<PhotoSwipe.Options>;
  export default PhotoSwipeUI_Default;
}
