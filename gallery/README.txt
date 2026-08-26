HOW TO ADD PHOTOS TO THE GALLERY
=================================

There are three albums, each in its own folder:

  gallery/campus/   -> "Campus & classrooms"
  gallery/sports/   -> "Sports & annual day"
  gallery/events/   -> "Celebrations & events"

FOR EACH ALBUM, TWO THINGS:
----------------------------

1) THE COVER PHOTO (thumbnail)
   Upload a photo into the album folder and name it exactly:

       thumbnail.jpg

   That photo will automatically be used as the cover picture for
   that album on the main Gallery page. No other step needed for
   this one — just the filename has to match exactly.

2) THE PHOTOS INSIDE THE ALBUM
   Upload your photo files into the same folder (any file names you
   like, e.g. sports-day-1.jpg, annual-function-3.jpg, etc).

   Then open the "photos.txt" file in that same folder in any plain
   text editor (Notepad, TextEdit, etc.) and add the file name of
   each photo, one per line. For example, if you uploaded:

       sports-day-1.jpg
       sports-day-2.jpg
       relay-race.jpg

   ...into gallery/sports/, then gallery/sports/photos.txt should
   contain:

       sports-day-1.jpg
       sports-day-2.jpg
       relay-race.jpg

   Lines starting with # are ignored, so you can leave notes.
   The photos will appear on the website in the same order they're
   listed in photos.txt.

WHY THIS STEP IS NEEDED
------------------------
This is a plain, static website with no server-side software behind
it, so it can't automatically "see" what files exist in a folder —
it can only show photos it's been told about. Listing the filename
in photos.txt is that one-line way of telling it. Everything else
(the tiled/Pinterest-style layout, click-to-enlarge, photo counts)
happens automatically once the file is listed.

TIPS
----
- Use reasonably sized images (under ~2MB each) so the gallery page
  loads quickly, especially on mobile.
- JPG or PNG both work.
- If a listed file is missing or misspelled, it's simply skipped —
  it won't break the page.
