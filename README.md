# What is this?
Pump Details is a script to track title progress in Pump It Up easier. It does this by scraping player scores from piugame.com, then calculating the point values associated with each score. This information is then displayed in an info box for the user to reference.

To use Pump Details, create a bookmark containing the following code as the URL:
```
javascript:(function(){var d=document;var e=d.createElement('script');e.src='https://cdn.jsdelivr.net/gh/PhilAtk/pump-details/pump-details.js';d.getElementsByTagName('head')[0].appendChild(e);})()
```

Then access the bookmark while logged in at the [Pump It Up Website](https://piugame.com/)

Scores will be saved in localStorage for the website, so you won't have to scrape old scores again on repeat visits.

## TODO
- Add a check for if user is logged in or not (and throw appropriate messages if not)
- Screenshot for this page
- Make score fetching async (it currently freezes the page while fetching)
- Display more ranks required to earn a title than just A and SSS+
- Find if there's a good way to get around the MIME type mismatch without using a git mirror

## Reference
The calculations for this are based off of the [Pump It Up Title Calculator](https://docs.google.com/spreadsheets/d/1O3xmKyy3kZlB87YcUIQvnQkA0FMCfhCoPXz2V-o7Lwk/edit#gid=0) spreadsheet. The Pumbility cutoffs are based off speculation from the official PIU Discord Server. Thank you to VKIM for the additional grade cutoff values that I couldn't find elsewhere.

The concept is largely based off of [vaddict](https://vaddict.b35.jp/), and how it loads the required code to scrape scores.
