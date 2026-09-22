import fs from 'node:fs';
const chromium=(await import('@sparticuz/chromium')).default;
const puppeteer=(await import('puppeteer-core')).default;
const b=await puppeteer.launch({executablePath:await chromium.executablePath(),args:[...(chromium.args||[]),'--no-sandbox','--disable-dev-shm-usage'],headless:'shell'});
try{
  const page=await b.newPage(); await page.setContent('<canvas id=c></canvas>');
  for (const size of [192,512]) {
    const url = await page.evaluate((size)=>{
      const c=document.getElementById('c'); c.width=c.height=size; const x=c.getContext('2d'); const u=size/16;
      x.fillStyle='#1C2433'; x.fillRect(0,0,size,size);
      // three lines of code; the middle one is running, on the highlighter
      x.fillStyle='#5B6577';
      x.fillRect(u*3.5,u*4.6,u*7.5,u*1.1);
      x.fillRect(u*3.5,u*10.3,u*5.5,u*1.1);
      x.fillStyle='#FFE45C'; x.fillRect(0,u*6.7,size,u*2.6);
      x.fillStyle='#1C2433'; x.fillRect(u*3.5,u*7.45,u*9,u*1.1);
      return c.toDataURL('image/png');
    }, size);
    fs.writeFileSync('pages/icons/icon-'+size+'.png', Buffer.from(url.split(',')[1],'base64'));
  }
  console.log('icons redrawn');
} finally { await b.close(); }
