(function(){
  const NS='http://www.w3.org/2000/svg';
  const el=(n,a={})=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);return e};

  /* sparklines */
  document.querySelectorAll('svg.spark[data-points]').forEach(svg=>{
    const p=svg.dataset.points.split(',').map(Number);
    const min=Math.min(...p),max=Math.max(...p),W=100,H=30;
    const pts=p.map((v,i)=>[i/(p.length-1)*W,H-2-(v-min)/(max-min||1)*(H-4)]);
    svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('preserveAspectRatio','none');
    svg.appendChild(el('polygon',{class:'area',points:pts.map(x=>x.join(',')).join(' ')+' '+W+','+H+' 0,'+H}));
    svg.appendChild(el('polyline',{points:pts.map(x=>x.join(',')).join(' ')}));
  });

  /* club chart */
  const chart=document.getElementById('clubChart');
  if(chart){
    const W=340,H=170,L=34,B=24,T=8,rows=[140,120,100,80],ph=(H-B-T)/3;
    const yOf=v=>T+(140-v)/60*(H-B-T);
    function draw(btn){
      chart.innerHTML='';
      rows.forEach((v,i)=>{const y=T+i*ph;
        chart.appendChild(el('line',{x1:L,x2:W,y1:y,y2:y,stroke:'rgba(110,150,210,.18)'}));
        const t=el('text',{x:0,y:y+3});t.textContent=v;chart.appendChild(t);});
      const p=btn.dataset.points.split(',').map(Number),labels=btn.dataset.labels.split(',');
      const pts=p.map((v,i)=>[L+i/(p.length-1)*(W-L-4),yOf(v)]);
      const defs=el('defs');const g=el('linearGradient',{id:'cg',x1:0,y1:0,x2:0,y2:1});
      g.appendChild(el('stop',{offset:'0','stop-color':'#19e68c','stop-opacity':.38}));
      g.appendChild(el('stop',{offset:'1','stop-color':'#19e68c','stop-opacity':0}));defs.appendChild(g);chart.appendChild(defs);
      const s=pts.map(x=>x.join(',')).join(' ');
      chart.appendChild(el('polygon',{points:s+' '+pts[pts.length-1][0]+','+(H-B)+' '+L+','+(H-B),fill:'url(#cg)'}));
      chart.appendChild(el('polyline',{points:s,fill:'none',stroke:'#19e68c','stroke-width':2,'stroke-linejoin':'round'}));
      labels.forEach((l,i)=>{const t=el('text',{x:L+i/(labels.length-1)*(W-L-4),y:H-6,'text-anchor':i==0?'start':i==labels.length-1?'end':'middle'});t.textContent=l;chart.appendChild(t);});
    }
    const btns=document.querySelectorAll('#periods button');
    btns.forEach(b=>b.addEventListener('click',()=>{btns.forEach(x=>x.classList.toggle('active',x===b));draw(b)}));
    draw(document.querySelector('#periods button.active'));
  }

  /* generic segmented / chip filters */
  document.querySelectorAll('[data-seg]').forEach(box=>{
    const btns=box.querySelectorAll('button');
    btns.forEach(b=>b.addEventListener('click',()=>{
      btns.forEach(x=>x.classList.toggle('active',x===b));
      const t=document.querySelectorAll(box.dataset.seg);
      t.forEach(p=>p.hidden=p.dataset.panel!==b.dataset.v);
    }));
  });

  /* quotes: country chips + search */
  const rows=[...document.querySelectorAll('#quotes .qrow')],q=document.getElementById('qSearch');
  let country='Все';
  function filterQ(){const s=q.value.trim().toLowerCase();
    rows.forEach(r=>r.hidden=!((country==='Все'||r.dataset.country===country)&&r.dataset.name.toLowerCase().includes(s)));}
  document.querySelectorAll('#qChips .chip').forEach(c=>c.addEventListener('click',()=>{
    document.querySelectorAll('#qChips .chip').forEach(x=>x.classList.toggle('active',x===c));country=c.dataset.v;filterQ();}));
  q&&q.addEventListener('input',filterQ);

  /* news chips */
  document.querySelectorAll('#nChips .chip').forEach(c=>c.addEventListener('click',()=>{
    document.querySelectorAll('#nChips .chip').forEach(x=>x.classList.toggle('active',x===c));
    document.querySelectorAll('#news .news').forEach(n=>n.hidden=!(c.dataset.v==='all'||n.dataset.cat===c.dataset.v));}));

  /* favourite */
  const fav=document.querySelector('.fav');fav&&fav.addEventListener('click',()=>fav.classList.toggle('on'));

})();
