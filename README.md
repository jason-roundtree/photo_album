# Personal Photoghraphy App

## Built With 
- Next.js / React
- Pure React Carousel
- React Photo Gallery
- Styled Components 
- Cloudinary Admin & Search APIs

## TODOs
- Add image loading placeholder to gallery and carousel
- Move close carousel button to be fixed to upper right of screen (also do more debugging to figure out why it's such a pain to fight Pure-React-Carousel to position the carousel buttons relative to contained image width)
- Hide carousel buttons until image is rendered
- Show next/previous carousel image buttons as disabled when on 1st/last images
- Allow carousel to be closed on click outside image or with ESC key, etc
- Add image numbers to carousel (e.g. 3/7)
- Find out how to sort or reorder images in Cloudinary by order pictures were taken or sort by time pictures were taken (is this only possible with paid plan??)
- Ask Cloudinary if there's a way to get folder paths without using the Admin API
- Add UI loader for when returning to main page from album
- Add field to contextual metadata in Cloudinary for showing more info about the album location (e.g. region, mountain, etc.) and maybe another one for custom notes about the location (e.g. why there's poor image quality, weather conditions, etc)
- Add a better nav/header with maybe an about page and links to my other sites
- Change main/previews to be a grid instead of just stacked one on-top of the other?
- Research why Next/Image was being slow and what can be done to help all around performance?
- Add feature that allows users to easily download image with attribution?