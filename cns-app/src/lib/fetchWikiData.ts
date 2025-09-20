import axios from "axios";
import prisma from "../../prisma/db";

interface WikiFetchProps {
  selectedWikiId: number | undefined;
  setWikiName: React.Dispatch<React.SetStateAction<string>>;
}

// Make this a more global function

/**
 * Accepts a wiki id and setter function to set a wiki display name to the related wiki object
 * @param {number} selectedWikiId - Wiki Id to fetch name from
 * @param {React.Dispatch<React.SetStateAction<string>>} setWikiName - Setter function to set wiki name from id
 */
export async function fetchWikiName({
  selectedWikiId,
  setWikiName,
}: WikiFetchProps) {
  if (!selectedWikiId) {
    setWikiName("");
    return;
  }

  try {
    const response = await axios.get(`/api/wiki/${selectedWikiId}`);
    if (response.data && response.data.title) {
      setWikiName(response.data.title);
    }
  } catch (error) {
    console.error("Error fetching wiki data:", error);
    setWikiName("");
  }
}

export async function fetchInfobox(wikiId: number) {
  try {
    const infobox = await axios.get(`/api/wiki/${wikiId}/infobox`);
    return { infobox };
  } catch (error) {
    console.error("Error fetching wiki data:", error);
    return;
  }
}
