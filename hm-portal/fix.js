const fs = require('fs');
let content = fs.readFileSync('src/components/layout/PortalSidebar.tsx', 'utf8');

content = content.replace(/\{!isCollapsed && <span>(.*?)<\/span>\}/g, '<span className={isCollapsed ? "md:hidden" : ""}>$1</span>');
content = content.replace(/(<Link href=[^>]+className=\{getLinkClass[^>]*)>/g, '$1 onClick={closeMobileSidebar}>');
content = content.replace(/onClick=\{closeMobileSidebar\} onClick=\{closeMobileSidebar\}/g, 'onClick={closeMobileSidebar}');

fs.writeFileSync('src/components/layout/PortalSidebar.tsx', content);
