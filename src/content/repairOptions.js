// Editable copy for the Repair Options screen — data lives in
// ./data/repairOptions.json (edit via the admin tool: npm run admin). JSON can't
// hold Infinity, so the "5 minutes plus" time filter stores `maxMinutes: null`
// and it's restored to Infinity here.
import data from './data/repairOptions.json'

export const subheading = data.subheading
export const eightBallLabel = data.eightBallLabel
export const filtersLabel = data.filtersLabel
export const resetLabel = data.resetLabel
export const eightBallPopup = data.eightBallPopup

export const filterGroups = {
  ...data.filterGroups,
  time: {
    ...data.filterGroups.time,
    items: data.filterGroups.time.items.map((item) => ({
      ...item,
      maxMinutes: item.maxMinutes === null ? Infinity : item.maxMinutes,
    })),
  },
}

export const repairMethods = data.repairMethods
