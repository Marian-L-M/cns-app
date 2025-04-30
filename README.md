# 250310 To Do

## Major bugs

1. Rwork edit mode in editors - e & enter listener block substory (eventually other editors as well from ) writing
2. Substory submission is broken - Post endpoint (not update)
   -> narrowed down issue: it is only broken on initial post WHEN nodes are added. No nodes initial post works. Updating with nodes later also works
3. Map search box creates uncontrolled element issue
4. Add error formatting to all submissions

## General

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

- System message banner (floating not blocked)
- Map hover banner (floating not blocked)

### Users

- Create private routes for editing and commenting
- Add editor role

## Dashboard

- Rethink page structure
- Create Dashboard display concept
- Create admin dashboard to control what is displayed on dashboard
- Create analytics

## Stories

- Work on UI
- Add story body section below
- Add story editor (Adding story item + json story points)

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

## Wiki

- [x] Wiki edit screen
- Create Wiki Dashboard and Dashboard editing too

## Timelines & History

- Create a timeline tool
- Integrate with Wiki

## DB

- Production docker compose Neon/Vercel -> adjust docker compose (additional production files + vercel environment variables)
