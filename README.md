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

- System message banner (floating not blocked)
- Map hover banner (floating not blocked)

### Users

- Create private routes for editing and commenting
- Add editor role
- Protect sbumission routes with auth?
- Verification mail

# All Editors

- Add style object
- Full screen mode
- Support standard aspect ratios (Or get it from image object) 1:2 3:4 1:1 4:3 2:1

## Dashboard

- Rethink page structure
- Create Dashboard display concept
- Create admin dashboard to control what is displayed on dashboard
- Create analytics

## Stories

- Multi Map Story
- Story display module, hide areas and objects on click

## Map Editor

- [x] Add mastermap flag and master array to maps
- [x] Add Map editor tool (adding areas by clicking on map)
      -- [x] Draw area tool
      -- Add image selector +alpha -> ai integration?
      -- [x] Add information to map (Submit like an object)
      -- Join with existing maps
- Unify thumbnail and image name
- Enable upload for images
- Dynamic wiki integration
- [] Area editor
  -- [x] Reposition nodes
  -- [x] Explicit delete
  -- [] Tooltips
  -- [] Ui fix
  -- [] Transparent colors
- [] Object editor
  -- Change icon size (Has a lot of implecations for e.g. hover states)
  -- Fix object hover effects
  -- Default icon menu (Structure & search)
- Map Cetegory enumeration
- Priority true to map images

## MasterMap

- [] add style object to mastermaps
- Nice to have: Nested mastermaps

## Wiki

- [x] Wiki edit screen
- Create Wiki Dashboard and Dashboard editing too
- Need remove wiki button
- Editor and Reader search logic + editor prefiltering according to permission

## Admin

- set available map icons
- set wiki screen
- set landing page
- manage users

## Timelines & History

- Create a timeline tool
- Integrate with Wiki

## DB

- Production docker compose Neon/Vercel -> adjust docker compose (additional production files + vercel environment variables)

## Auth

- Check if API routes can be accessed without auth

# Setup

## .env

- uploadthing -> Create a wrapper for upload component to make it replaceable
