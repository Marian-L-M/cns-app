# 250310 To Do

# Naming conventions

Kebab-case for Pages, files
PascalCase for Components, Classes, interface names, type names, enum names
camelCase for custom Functions & Variables & interface members.

https://nextjs.org/docs/app/api-reference/file-conventions

## Major bugs/mistakes

1. Rwork edit mode in editors - e & enter listener block substory (eventually other editors as well from ) writing
2. Substory submission is broken - Post endpoint (not update)
   -> narrowed down issue: it is only broken on initial post WHEN nodes are added. No nodes initial post works. Updating with nodes later also works
3. Map search box creates uncontrolled element issue
4. Add error formatting to all submissions
5. Add toaster for submissions
6. Custom bar for hover etc(?)
7. Remove React.FCs
8. Move Prisma into src folder
9. Move useMapHooks etc to lib since they are not hooks (? check terminology)
10. Medialibrary to reuse images
11. Image element breaks on invalid url, but image field is directly editable -> risk of system error hight. Need validation?
12. Mastermap editor, moving frames blasts update depth (set state in useEffect)
13. Mastermap map search box needs a prefilter, else if you select already submitted map twice, you will get a submission error
14. Forms have no submission error messages
15. Validation redirect is not instant on failure -> In async chain contents may be loaded for a second
16. Protect api?
17. Hierarchy typings are fubar. Burn and rebuild. Mastermaps treats childmaps as maps. Childmap treats individual childmaps like extended hierarchychild with map attached.
18. Disentangle Mastermap form from editor(?)
19. Bug when submitting wiki
20. Json fields infobox and styles should actually be relational tables (Only two groups overall: StylesObject & Infoboxitem everything else to be handled by relation to the parent object)
21. drawMetaNodes -> same name two functions (Map nodes and story nodes)
22. Editor redraw to usecallback instead of useeffect?
23. make Inactive users unable to login ✅
24. Add socials functionality for user
25. Unify api route writing patterns (Its atrocious)
26. Get collaborator functionality working
27. Overlapping areas/object and stories -> Stories should trigger first
28. Childmap submissions: filter out parent map and already selected
29. Admin page settings - submitting id items with the same setting leads to error

## General

0. Clean up to do in pre publish and roadmap
1. Private routes
2. General code cleanup
3. Refactor and unify typings (Its a mess)
4. Unify hooks
5. unify map and story modules
6. Move all class components to functional components
7. Unify naming story entry (same thing different names)
   -> entries are stories in the ui, and stories in the db are substories of the entry -> rename Story/Substory
8. Add meta data to all pages.
9. Create prerendered pages
10. Rework UI state
11. CW,ch, ctx should really be an object
12. Submission via canvas coordinates should be divided by cw/ch, drawing values should be multiplied by cw/ch, numbers submitted in form as is
13. Initialization?
14. Version management
15. Unify route naming patterns
16. Set dynamic metadata
17. Progressive web app
18. Universally integrate metadata
19. Reduce DB requests?
20. Prerendering & seo, especially wikis
21. Cookies & GDPR
22. General delete functionality for editors
23. Should a user only be allowed to edit their own maps or access a global pool? Should there be a flag for maps to be globally editable or not?
24. Should substories have separate verification from story? (If not delete authors from substory) Should still have benefits to track who edited what
25. Pregenerate pages for SEO
26. Map Display full size mode/lightbox
27. Breadcrumbs
28. Dictionary , Dramatis Personae
29. Conjoined storypoint issue

30. System message banner (floating not blocked)
31. Map hover banner (floating not blocked)
32. storytime conversion.
33. Story/wiki/map banners
34. Admin settings add meta value to e.g. control width/col span

### Users

1. Create private routes for editing and commenting
2. Add editor role
3. Protect sbumission routes with auth?
4. Verification mail

## Dashboard

1. Create Dashboard display concept
2. Create admin dashboard to control what is displayed on dashboard
3. Create analytics

## Stories

1. Multi Map Story
2. Story display module, hide areas and objects on click

## Map Editor

1. Unify thumbnail and image name
2. Enable upload toggle for different approaches
3. Dynamic wiki integration
4. Area editor
   -- [] Tooltips
   -- [] Ui fix
5. Map Cetegory enumeration
6. Priority true to map images

## MasterMap

1. Nice to have: Nested mastermaps
2. Preload images for hover

## Wiki

1. Need remove wiki button
2. Editor and Reader search logic + editor prefiltering according to permission

## Admin

1. set available map icons
2. set wiki screen

## Timelines & History

1. Create a timeline tool -> Hook up to year not node(?)
2. Timeline slide
3. Through the times functionality
4. Integrate with Wiki
5. Display date or other directional indicator on story timeline (E.g. an arrow in the line)

## DB

1. Production docker compose Neon/Vercel -> adjust docker compose (additional production files + vercel environment variables)

## Auth

1. Check if API routes can be accessed without auth
2. Check if no page was forgotten in editor and admin

# Setup

## .env

1. uploadthing -> Create a wrapper for upload component to make it replaceable
