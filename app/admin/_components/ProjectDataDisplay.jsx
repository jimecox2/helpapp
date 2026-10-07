function ProjectDataDisplay({ pfRows, pjRows, orderList = [] }) {
  // Derive product flags from order list
  const hasCostbars  = orderList.some(o => (o?.product?.product_code || '').toUpperCase().startsWith('CB'));
  const hasTimebars  = orderList.some(o => (o?.product?.product_code || '').toUpperCase().startsWith('TB'));
  const hasAgilebars = orderList.some(o => (o?.product?.product_code || '').toUpperCase().startsWith('AB'));

  // Field visibility rules
  const showPortfolios = hasCostbars || hasTimebars;
  const showSV         = hasCostbars;
  const showAbility    = hasCostbars;
  const showRisk       = hasCostbars || hasTimebars;

  return (
    <div className="mt-6">
      <div className="mt-6 text-2xl font-extrabold mb-4">Portfolios and Projects Considered for Notifications</div>

      {showPortfolios && (
        <>
          <h2 className="text-xl font-extrabold mb-4">Portfolios</h2>
          {pfRows && pfRows.length > 0 ? (
            pfRows.map((row, index) => (
              <div key={index} className="border p-4 mb-2 rounded">
                <h3 className="font-semibold">Portfolio Name: {row.tbName}, ID: {row.tbID}</h3>
                <p className="mt-2">Owner: {row.tbOwner}, Overall Health: {row.tbMDHealthOverall}, WBS: {row.tbHierarchyOrder}</p>
                <p className="mt-2">Description: {row.tbMDDescription}</p>
              </div>
            ))
          ) : (
            <p className="mb-2">No portfolio projects found.</p>
          )}
        </>
      )}

      <h2 className="text-xl font-extrabold mt-8 mb-4">Projects</h2>
      {pjRows && pjRows.length > 0 ? (
        pjRows.map((row, index) => (
          <div key={index} className="border p-4 mb-2 rounded">
            <h3 className="font-semibold">Name: {row.tbName} (ID:{row.tbID}, Parent:{row.tbSelfKey2})</h3>
            <p className="mt-2">
              Owner: {row.tbOwner}, Exec. Commitment: {row.tbMDSeniorLevelCommitment}, WBS: {row.tbHierarchyOrder}, Status: {row.tbMDStatus}
            </p>
            <p className="mt-2">
              Overall Health: {row.tbMDHealthOverall}
              {showSV      && <>, SV: {row.tbMDPriorityStrategic}</>}
              {showAbility && <>, Ability to Succeed: {row.tbMDCostbarsScore}</>}
              {showRisk    && <>, Risk vs Size &amp; Complexity: {row.tbMDRiskVsSizeAndComplexity}</>}
            </p>
          </div>
        ))
      ) : (
        <p>No projects found.</p>
      )}
    </div>
  );
}

export default ProjectDataDisplay;
