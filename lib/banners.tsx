import type { SVGProps } from 'react'

export interface BannerMeta {
  id: string
  templateId: string   // which template this belongs to
  name: string
  Component: (props: SVGProps<SVGSVGElement>) => JSX.Element
}

// ── 🎂 Classic Birthday ──────────────────────────────────────────────────────

function BirthdayConfetti(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="b1bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4c1d95"/>
          <stop offset="50%" stopColor="#be185d"/>
          <stop offset="100%" stopColor="#b45309"/>
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#b1bg)"/>
      {/* Confetti dots */}
      {[['#fbbf24',60,30,14],['#34d399',180,55,9],['#f87171',320,25,11],['#60a5fa',480,45,13],['#a78bfa',620,30,10],['#fb923c',740,50,12],
        ['#f472b6',100,230,10],['#86efac',250,250,13],['#fde68a',400,240,9],['#c4b5fd',550,255,11],['#67e8f9',690,235,14],
        ['#fbbf24',30,150,7],['#34d399',770,140,8],['#f87171',150,130,6],['#60a5fa',660,170,7]
      ].map(([c,x,y,r],i) => <circle key={i} cx={+x} cy={+y} r={+r} fill={c as string} opacity="0.85"/>)}
      {/* Streamers */}
      <path d="M0,80 Q200,40 400,90 Q600,140 800,80" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.4"/>
      <path d="M0,120 Q200,170 400,120 Q600,70 800,130" fill="none" stroke="#f472b6" strokeWidth="3" opacity="0.4"/>
      {/* Cake */}
      <g transform="translate(400,140)">
        <rect x="-55" y="0" width="110" height="55" rx="6" fill="#fde68a"/>
        <rect x="-45" y="-28" width="90" height="35" rx="5" fill="#fbbf24"/>
        <rect x="-30" y="-48" width="60" height="25" rx="4" fill="#fef3c7"/>
        {/* Candles */}
        {[-20,-7,7,20].map((x,i)=><g key={i}><rect x={x-3} y={-70} width="6" height="22" rx="2" fill={['#f87171','#60a5fa','#34d399','#a78bfa'][i]}/><ellipse cx={x} cy={-72} rx="4" ry="6" fill="#fbbf24"/></g>)}
        {/* Frosting drips */}
        {[-35,-15,5,25,45].map((x,i)=><path key={i} d={`M${x-8},-28 Q${x},-18 ${x+8},-28`} fill="#fff" opacity="0.6"/>)}
        {/* Decorations on cake */}
        <circle cx="-25" cy="25" r="6" fill="#f87171" opacity="0.8"/>
        <circle cx="0" cy="22" r="6" fill="#60a5fa" opacity="0.8"/>
        <circle cx="25" cy="25" r="6" fill="#34d399" opacity="0.8"/>
      </g>
      {/* Stars */}
      {[[80,100],[720,110],[160,200],[640,190],[400,50]].map(([x,y],i)=>(
        <text key={i} x={x} y={y} textAnchor="middle" fontSize="22" fill="white" opacity="0.5">✦</text>
      ))}
      {/* Balloons */}
      {[140, 650].map((x, i) => (
        <g key={i} transform={`translate(${x},70)`}>
          <ellipse rx="28" ry="35" fill={['#f87171','#a78bfa'][i]} opacity="0.75"/>
          <path d="M0,35 Q5,55 0,75" fill="none" stroke="#ffffff88" strokeWidth="1.5"/>
        </g>
      ))}
    </svg>
  )
}

function BirthdayGold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="b2bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e0a3c"/>
          <stop offset="100%" stopColor="#3b0764"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="280" fill="url(#b2bg)"/>
      <ellipse cx="400" cy="140" rx="220" ry="160" fill="url(#glow)"/>
      {/* Gold star burst */}
      {Array.from({length:16},(_,i)=>{
        const a=(i*22.5)*Math.PI/180; const r1=40,r2=90
        return <line key={i} x1={400+r1*Math.cos(a)} y1={140+r1*Math.sin(a)} x2={400+r2*Math.cos(a)} y2={140+r2*Math.sin(a)} stroke="#fbbf24" strokeWidth="2" opacity="0.6"/>
      })}
      {/* Crown */}
      <g transform="translate(400,118)">
        <path d="M-50,30 L-50,-10 L-25,20 L0,-20 L25,20 L50,-10 L50,30 Z" fill="#fbbf24"/>
        <rect x="-50" y="26" width="100" height="18" rx="4" fill="#b45309"/>
        <circle cx="-25" cy="2" r="7" fill="#ef4444"/>
        <circle cx="0" cy="-8" r="7" fill="#3b82f6"/>
        <circle cx="25" cy="2" r="7" fill="#ef4444"/>
        {/* Crown shine */}
        <path d="M-45,10 Q-35,-5 -25,5" fill="none" stroke="white" strokeWidth="2" opacity="0.4"/>
      </g>
      {/* Stars scattered */}
      {[[80,40],[720,45],[100,220],[700,215],[200,150],[600,145],[50,130],[750,135]].map(([x,y],i)=>(
        <text key={i} x={x} y={y} textAnchor="middle" fontSize={i%2===0?18:12} fill="#fbbf24" opacity="0.6">★</text>
      ))}
      {/* Fairy lights string */}
      <path d="M0,20 Q100,10 200,25 Q300,40 400,20 Q500,5 600,25 Q700,40 800,20" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.4"/>
      {[0,100,200,300,400,500,600,700,800].map((x,i)=>(
        <circle key={i} cx={x} cy={20+Math.sin(i)*8} r="5" fill="#fbbf24" opacity="0.7"/>
      ))}
    </svg>
  )
}

// ── 🍌 Minions ───────────────────────────────────────────────────────────────

function MinionsBanana(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="800" height="280" fill="#FFD700"/>
      {/* Diagonal stripes */}
      {[-200,-100,0,100,200,300,400,500,600,700,800,900].map((x,i)=>(
        <path key={i} d={`M${x},0 L${x+100},0 L${x-60},280 L${x-160},280 Z`} fill="#FFC200" opacity="0.4"/>
      ))}
      {/* Goggle shapes as pattern */}
      {[[140,80],[400,70],[660,80],[270,180],[530,185]].map(([x,y],i)=>(
        <g key={i} transform={`translate(${x},${y})`}>
          <rect x="-55" y="-18" width="110" height="36" rx="6" fill="#1a4080" opacity="0.7"/>
          <circle cx="-20" cy="0" r="22" fill="#7ba7c7" opacity="0.8"/>
          <circle cx="-20" cy="0" r="17" fill="white" opacity="0.9"/>
          <circle cx="-20" cy="0" r="10" fill="#2a1a0a"/>
          <circle cx="-15" cy="-5" r="4" fill="white"/>
          <circle cx="20" cy="0" r="22" fill="#7ba7c7" opacity="0.8"/>
          <circle cx="20" cy="0" r="17" fill="white" opacity="0.9"/>
          <circle cx="20" cy="0" r="10" fill="#2a1a0a"/>
          <circle cx="25" cy="-5" r="4" fill="white"/>
        </g>
      ))}
      {/* Banana shapes */}
      {[[60,220,'-30deg'],[740,40,'20deg'],[30,100,'40deg'],[770,200,'-20deg']].map(([x,y,r],i)=>(
        <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
          <path d="M0,-30 Q30,-20 35,10 Q30,30 0,35 Q-5,15 -5,-20 Z" fill="#e6b800" opacity="0.8"/>
          <path d="M0,-30 Q28,-18 32,10 Q28,28 2,33" fill="none" stroke="#b8900a" strokeWidth="2" opacity="0.5"/>
        </g>
      ))}
      {/* Blue bottom bar */}
      <rect y="248" width="800" height="32" fill="#005B99" opacity="0.85"/>
      {/* "BANANA!" text bubbles */}
      {[[160,260,'🍌'],[400,261,'😄'],[640,260,'🍌']].map(([x,y,t],i)=>(
        <text key={i} x={x} y={y} textAnchor="middle" fontSize="18" fill="white">{t}</text>
      ))}
    </svg>
  )
}

function MinionsParty(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="minbg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#005B99"/>
          <stop offset="45%" stopColor="#005B99"/>
          <stop offset="45%" stopColor="#FFD700"/>
          <stop offset="100%" stopColor="#FFD700"/>
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#minbg)"/>
      {/* Stars in blue section */}
      {[[80,60],[200,35],[350,55],[500,40],[650,65],[740,35]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="5" fill="white" opacity="0.4"/>
      ))}
      {/* Large minion face center */}
      <g transform="translate(400,140)">
        <ellipse rx="70" ry="80" fill="#FFD700"/>
        <rect x="-70" y="-22" width="140" height="44" rx="8" fill="#1a4080"/>
        <circle cx="-22" cy="0" r="30" fill="#8ab4d4"/>
        <circle cx="-22" cy="0" r="24" fill="white"/>
        <circle cx="-22" cy="0" r="15" fill="#2a1a0a"/>
        <circle cx="-15" cy="-6" r="6" fill="white"/>
        <circle cx="22" cy="0" r="30" fill="#8ab4d4"/>
        <circle cx="22" cy="0" r="24" fill="white"/>
        <circle cx="22" cy="0" r="15" fill="#2a1a0a"/>
        <circle cx="29" cy="-6" r="6" fill="white"/>
        <path d="M-30,38 Q0,55 30,38" fill="none" stroke="#2a1a0a" strokeWidth="4" strokeLinecap="round"/>
        <rect x="-12" y="38" width="10" height="12" rx="2" fill="white"/>
        <rect x="2" y="38" width="10" height="12" rx="2" fill="white"/>
        {/* Hair */}
        {[-20,-5,10].map((x,i)=>(
          <path key={i} d={`M${x},-78 Q${x+5},-98 ${x+12},-78`} fill="none" stroke="#2a1a0a" strokeWidth="4" strokeLinecap="round"/>
        ))}
        {/* Overalls */}
        <rect x="-70" y="55" width="140" height="35" rx="6" fill="#005B99"/>
        <rect x="-22" y="55" width="44" height="22" rx="4" fill="#004a80"/>
      </g>
      {/* Bananas on sides */}
      {[60,740].map((x,i)=>(
        <g key={i} transform={`translate(${x},140) scale(${i===0?1:-1},1)`}>
          <path d="M0,-50 Q50,-30 55,10 Q50,45 0,55 Q-8,20 -8,-35 Z" fill="#e6b800"/>
          <path d="M0,-50 Q47,-28 50,10 Q46,42 3,53" fill="none" stroke="#b8900a" strokeWidth="3" opacity="0.6"/>
        </g>
      ))}
    </svg>
  )
}

// ── 🕷️ Spider-Man ────────────────────────────────────────────────────────────

function SpidermanWeb(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Background: red left, blue right */}
      <rect width="480" height="280" fill="#C1111F"/>
      <rect x="480" width="320" height="280" fill="#0A2196"/>
      {/* Web lines from top-left */}
      {Array.from({length:12},(_,i)=>{
        const angle=(i*15-10)*Math.PI/180
        return <line key={i} x1="0" y1="0" x2={Math.cos(angle)*900} y2={Math.sin(angle)*900} stroke="white" strokeWidth="1.5" opacity="0.25"/>
      })}
      {/* Web arcs */}
      {[120,240,360,480,600].map((r,i)=>(
        <circle key={i} cx="0" cy="0" r={r} fill="none" stroke="white" strokeWidth="1.5" opacity="0.2"/>
      ))}
      {/* City skyline silhouette */}
      <g fill="#00000033">
        <rect x="0" y="190" width="60" height="90"/>
        <rect x="70" y="160" width="50" height="120"/>
        <rect x="130" y="175" width="70" height="105"/>
        <rect x="210" y="140" width="40" height="140"/>
        <rect x="260" y="170" width="55" height="110"/>
        <rect x="620" y="150" width="50" height="130"/>
        <rect x="680" y="165" width="45" height="115"/>
        <rect x="735" y="145" width="65" height="135"/>
      </g>
      {/* Spider emblem center */}
      <g transform="translate(400,130)">
        <ellipse cx="0" cy="0" rx="42" ry="28" fill="black" opacity="0.7"/>
        <ellipse cx="0" cy="0" rx="32" ry="20" fill="#C1111F"/>
        {/* Spider body */}
        <ellipse cx="0" cy="-3" rx="9" ry="14" fill="black"/>
        <ellipse cx="0" cy="12" rx="13" ry="10" fill="black"/>
        {/* Legs */}
        {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sy],i)=>(
          <g key={i}>
            <line x1={sx*10} y1={sy*5} x2={sx*30} y2={sy*22} stroke="black" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1={sx*30} y1={sy*22} x2={sx*22} y2={sy*38} stroke="black" strokeWidth="3" strokeLinecap="round"/>
          </g>
        ))}
        <ellipse cx="0" cy="-3" rx="9" ry="14" fill="black"/>
        <ellipse cx="0" cy="12" rx="13" ry="10" fill="black"/>
      </g>
    </svg>
  )
}

function SpidermanCity(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0d0221"/>
          <stop offset="60%" stopColor="#1a0540"/>
          <stop offset="100%" stopColor="#2d0a6b"/>
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#sky)"/>
      {/* Stars */}
      {[[50,20],[150,40],[280,15],[420,30],[560,18],[680,35],[760,12],[120,80],[340,60],[500,75],[720,65]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%3===0?2.5:1.5} fill="white" opacity={0.5+i*0.04}/>
      ))}
      {/* Moon */}
      <circle cx="700" cy="50" r="35" fill="#fffde7" opacity="0.9"/>
      <circle cx="715" cy="42" r="28" fill="#1a0540"/>
      {/* City silhouette */}
      <g fill="#0d0221">
        {[[0,120,55],[65,95,45],[120,140,60],[190,80,40],[240,110,55],[305,65,45],[360,100,70],[440,75,50],[500,115,60],[570,55,45],[625,100,55],[690,70,50],[750,110,55]].map(([x,y,w],i)=>(
          <rect key={i} x={x} y={y} width={w} height={280-y}/>
        ))}
      </g>
      {/* Windows in buildings - yellow dots */}
      {[[20,150],[30,170],[20,190],[80,115],[90,135],[80,155],[135,160],[150,180],[220,100],[230,120],[220,140],[270,130],[285,150],[375,120],[390,140],[375,160],[460,95],[470,115],[530,135],[540,155],[590,75],[600,95],[640,120],[650,140],[710,90],[720,110]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width="8" height="10" rx="1" fill="#fbbf24" opacity="0.6"/>
      ))}
      {/* Red web strand */}
      <path d="M750,0 Q600,80 400,60 Q200,40 50,120" fill="none" stroke="#C1111F" strokeWidth="3" opacity="0.8"/>
      {/* Spider silhouette swinging */}
      <g transform="translate(420,58) rotate(-15)">
        <ellipse rx="12" ry="16" fill="#C1111F"/>
        <ellipse cy="22" rx="16" ry="12" fill="#C1111F"/>
        {[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sy],i)=>(
          <line key={i} x1={sx*13} y1={sy*6+5} x2={sx*28} y2={sy*20+5} stroke="#C1111F" strokeWidth="3"/>
        ))}
      </g>
    </svg>
  )
}

// ── ⛏️ Minecraft ─────────────────────────────────────────────────────────────

function MinecraftLandscape(props: SVGProps<SVGSVGElement>) {
  const px = 20  // pixel size
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Sky */}
      <rect width="800" height="280" fill="#87CEEB"/>
      {/* Sun */}
      <rect x="680" y="20" width={px*3} height={px*3} fill="#FFD700"/>
      <rect x="680" y="20" width={px*3} height={px*3} fill="#FFF176" opacity="0.4"/>
      {/* Pixel clouds */}
      {[[80,40],[300,30],[550,50]].map(([cx,cy],i)=>(
        <g key={i}>
          {[[0,1],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2],[3,1]].map(([dx,dy],j)=>(
            <rect key={j} x={cx+dx*px} y={cy+dy*px} width={px} height={px} fill="white" opacity="0.9"/>
          ))}
        </g>
      ))}
      {/* Grass blocks (row at y=180) */}
      {Array.from({length:40},(_,i)=>(
        <g key={i}>
          <rect x={i*px} y={180} width={px} height={px} fill="#5D8731"/>
          <rect x={i*px+1} y={181} width={px-2} height={4} fill="#7ab341" opacity="0.5"/>
          <rect x={i*px} y={200} width={px} height={px} fill="#8B5E3C"/>
          <rect x={i*px} y={220} width={px} height={px} fill="#7a5230"/>
          <rect x={i*px} y={240} width={px} height={px} fill="#6b4423"/>
          <rect x={i*px} y={260} width={px} height={px} fill="#5c3a1a"/>
        </g>
      ))}
      {/* Trees */}
      {[80,220,420,580,720].map((x,i)=>(
        <g key={i}>
          {/* Trunk */}
          <rect x={x} y={140} width={px*2} height={px*2} fill="#8B5E3C"/>
          <rect x={x} y={160} width={px*2} height={px} fill="#7a5230"/>
          {/* Leaves */}
          {[[-1,0],[0,-1],[1,0],[0,1],[-1,-1],[1,-1],[0,0]].map(([dx,dy],j)=>(
            <rect key={j} x={x+px*dx} y={100+px*dy} width={px*2} height={px*2} fill="#2d6a1f"/>
          ))}
        </g>
      ))}
      {/* Creeper face in center */}
      <g transform="translate(370,90)">
        <rect x="0" y="0" width={px*3} height={px*3} fill="#4CAF50"/>
        <rect x={px*0.5} y={px*0.5} width={px} height={px} fill="#1a1a1a"/>
        <rect x={px*1.5} y={px*0.5} width={px} height={px} fill="#1a1a1a"/>
        <rect x={px} y={px*1.5} width={px} height={px*0.5} fill="#1a1a1a"/>
        <rect x={px*0.5} y={px*2} width={px} height={px*0.5} fill="#1a1a1a"/>
        <rect x={px*1.5} y={px*2} width={px} height={px*0.5} fill="#1a1a1a"/>
      </g>
      {/* Diamond block */}
      <g transform="translate(600,120)">
        <rect width={px*2} height={px*2} fill="#44d4d4"/>
        <rect x="2" y="2" width={px*2-4} height={px*2-4} fill="#5de8e8"/>
        <path d={`M${px},3 L${px*2-3},${px} L${px},${px*2-3} L3,${px} Z`} fill="#00bcd4" opacity="0.5"/>
      </g>
    </svg>
  )
}

function MinecraftCave(props: SVGProps<SVGSVGElement>) {
  const px = 20
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Cave background */}
      <rect width="800" height="280" fill="#1a1a1a"/>
      {/* Stone blocks */}
      {Array.from({length:40*14},(_,i)=>{
        const col=i%40, row=Math.floor(i/40)
        const shade=['#555','#4a4a4a','#505050','#484848'][( col+row)%4]
        return <rect key={i} x={col*px} y={row*px} width={px-1} height={px-1} fill={shade}/>
      })}
      {/* Torch lights */}
      {[100,300,500,700].map((x,i)=>(
        <g key={i}>
          <rect x={x} y={60} width={8} height={20} fill="#8B5E3C"/>
          <ellipse cx={x+4} cy={55} rx={10} ry={14} fill="#FF6B00" opacity="0.8"/>
          <ellipse cx={x+4} cy={50} rx={6} ry={8} fill="#FFD700" opacity="0.9"/>
          {/* Light glow */}
          <ellipse cx={x+4} cy={80} rx={60} ry={40} fill="#FF6B00" opacity="0.07"/>
        </g>
      ))}
      {/* Diamond vein */}
      {[[200,200],[220,200],[220,220],[240,220],[260,200]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={px-1} height={px-1} fill="#00bcd4"/>
      ))}
      {/* Gold vein */}
      {[[500,180],[520,180],[520,200]].map(([x,y],i)=>(
        <rect key={i} x={x} y={y} width={px-1} height={px-1} fill="#FFD700"/>
      ))}
      {/* Emerald */}
      <rect x="620" y="160" width={px-1} height={px-1} fill="#00e676"/>
      {/* Cave opening (lighter top) */}
      <rect width="800" height="60" fill="#2a2a2a" opacity="0.6"/>
      {/* Stalactites */}
      {[50,160,290,420,560,670,760].map((x,i)=>(
        <path key={i} d={`M${x},0 L${x-12},${35+(i%3)*15} L${x+12},${35+(i%3)*15} Z`} fill="#333"/>
      ))}
    </svg>
  )
}

// ── 🎮 Roblox ────────────────────────────────────────────────────────────────

function RobloxGame(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="robg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f0f0f"/>
          <stop offset="100%" stopColor="#1a0000"/>
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#robg)"/>
      {/* Grid floor */}
      {Array.from({length:20},(_,i)=>(
        <line key={i} x1={i*40} y1="0" x2={i*40} y2="280" stroke="#CC0000" strokeWidth="0.5" opacity="0.15"/>
      ))}
      {Array.from({length:8},(_,i)=>(
        <line key={i} x1="0" y1={i*40} x2="800" y2={i*40} stroke="#CC0000" strokeWidth="0.5" opacity="0.15"/>
      ))}
      {/* Roblox "R" logo shape */}
      <g transform="translate(340,60)">
        <rect width="120" height="160" rx="8" fill="#CC0000"/>
        <rect x="15" y="15" width="55" height="130" rx="4" fill="#ff1a1a"/>
        <rect x="70" y="15" width="35" height="60" rx="4" fill="#ff1a1a"/>
        <rect x="70" y="90" width="35" height="55" rx="4" fill="#ff4444"/>
        <ellipse cx="87" cy="45" rx="18" ry="15" fill="#CC0000"/>
      </g>
      {/* Trophy */}
      <g transform="translate(160,80)">
        <path d="M-30,-20 Q-50,-50 -50,-70 L50,-70 Q50,-50 30,-20 Z" fill="#FFD700"/>
        <rect x="-8" y="-20" width="16" height="30" fill="#FFD700"/>
        <rect x="-25" y="10" width="50" height="12" rx="3" fill="#b8860b"/>
        <circle cx="0" cy="-50" r="12" fill="#FFF176" opacity="0.5"/>
        {/* Handles */}
        <path d="M-50,-60 Q-70,-60 -70,-40 Q-70,-25 -50,-30" fill="none" stroke="#FFD700" strokeWidth="10"/>
        <path d="M50,-60 Q70,-60 70,-40 Q70,-25 50,-30" fill="none" stroke="#FFD700" strokeWidth="10"/>
      </g>
      {/* Game controller */}
      <g transform="translate(580,130)">
        <rect x="-70" y="-30" width="140" height="80" rx="35" fill="#333"/>
        <rect x="-50" y="-20" width="100" height="60" rx="25" fill="#2a2a2a"/>
        {/* D-pad */}
        <rect x="-45" y="-8" width="12" height="36" rx="3" fill="#555"/>
        <rect x="-57" y="4" width="36" height="12" rx="3" fill="#555"/>
        {/* Buttons */}
        <circle cx="20" cy="-5" r="8" fill="#CC0000"/>
        <circle cx="35" cy="10" r="8" fill="#1a6600"/>
        <circle cx="20" cy="25" r="8" fill="#0066aa"/>
        <circle cx="5" cy="10" r="8" fill="#996600"/>
      </g>
      {/* Stars/sparkles */}
      {[[80,50],[700,60],[50,200],[750,190]].map(([x,y],i)=>(
        <text key={i} x={x} y={y} textAnchor="middle" fontSize="24" fill="#CC0000" opacity="0.6">✦</text>
      ))}
      {/* Health bar */}
      <g transform="translate(50,240)">
        <rect width="160" height="18" rx="9" fill="#333"/>
        <rect width="120" height="18" rx="9" fill="#CC0000"/>
        <text x="80" y="13" textAnchor="middle" fontSize="10" fill="white" fontFamily="monospace">HP 120/160</text>
      </g>
    </svg>
  )
}

function RobloxNoob(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="800" height="280" fill="#CC0000"/>
      {/* White block pattern */}
      {[[0,0],[2,0],[4,0],[1,1],[3,1],[0,2],[2,2],[4,2]].map(([col,row],i)=>(
        <rect key={i} x={col*160+40} y={row*90+20} width="80" height="80" rx="8" fill="white" opacity="0.08"/>
      ))}
      {/* Noob character */}
      <g transform="translate(400,100)">
        {/* Head */}
        <rect x="-40" y="-80" width="80" height="80" rx="8" fill="#FFFF00"/>
        <rect x="-20" y="-65" width="16" height="16" fill="#1a1a1a"/>
        <rect x="4" y="-65" width="16" height="16" fill="#1a1a1a"/>
        <rect x="-15" y="-38" width="30" height="10" rx="2" fill="#1a1a1a"/>
        <rect x="-10" y="-33" width="8" height="8" fill="white"/>
        <rect x="2" y="-33" width="8" height="8" fill="white"/>
        {/* Body */}
        <rect x="-40" y="5" width="80" height="80" rx="4" fill="#1E90FF"/>
        {/* Arms */}
        <rect x="-75" y="5" width="30" height="65" rx="4" fill="#1E90FF"/>
        <rect x="45" y="5" width="30" height="65" rx="4" fill="#1E90FF"/>
        {/* Legs */}
        <rect x="-38" y="88" width="32" height="55" rx="4" fill="#006400"/>
        <rect x="6" y="88" width="32" height="55" rx="4" fill="#006400"/>
        {/* Hands */}
        <rect x="-75" y="70" width="30" height="25" rx="4" fill="#FFFF00"/>
        <rect x="45" y="70" width="30" height="25" rx="4" fill="#FFFF00"/>
      </g>
      {/* "HAPPY BIRTHDAY" in block style */}
      {['HAPPY','BIRTHDAY'].map((word, i) => (
        <text key={i} x={400} y={i===0?240:265} textAnchor="middle" fontSize="28" fontWeight="bold"
          fontFamily="monospace" fill="white" letterSpacing="6" opacity="0.9">{word}</text>
      ))}
    </svg>
  )
}

// ── ⚔️ Demon Slayer ──────────────────────────────────────────────────────────

function DemonSlayerCheckerboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <pattern id="checker" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#1a472a"/>
          <rect x="24" width="24" height="24" fill="#0d1117"/>
          <rect y="24" width="24" height="24" fill="#0d1117"/>
          <rect x="24" y="24" width="24" height="24" fill="#1a472a"/>
        </pattern>
        <linearGradient id="dsoverlay" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8B0000" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#1a0000" stopOpacity="0.45"/>
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#checker)"/>
      <rect width="800" height="280" fill="url(#dsoverlay)"/>
      {/* Cherry blossoms */}
      {[[80,60],[150,40],[220,80],[600,50],[680,70],[740,45],[350,30],[450,55]].map(([x,y],i)=>(
        <g key={i} transform={`translate(${x},${y})`}>
          {[0,72,144,216,288].map((a,j)=>(
            <ellipse key={j} cx={Math.cos(a*Math.PI/180)*9} cy={Math.sin(a*Math.PI/180)*9}
              rx="6" ry="4" fill="#ffb7c5" opacity="0.85" transform={`rotate(${a})`}/>
          ))}
          <circle r="4" fill="#ffde59"/>
        </g>
      ))}
      {/* Falling petals */}
      {[[120,150,'-20deg'],[300,180,'15deg'],[500,130,'-30deg'],[660,170,'10deg'],[200,240,'25deg'],[550,250,'-15deg']].map(([x,y,r],i)=>(
        <ellipse key={i} cx={+x} cy={+y} rx="8" ry="5" fill="#ffb7c5" opacity="0.6" transform={`rotate(${r} ${x} ${y})`}/>
      ))}
      {/* Sword/Katana silhouette */}
      <g transform="translate(400,140) rotate(-45)">
        <rect x="-120" y="-4" width="240" height="8" rx="2" fill="white" opacity="0.9"/>
        <path d="M120,-8 L140,0 L120,8 Z" fill="#c0c0c0"/>
        <rect x="-15" y="-12" width="30" height="24" rx="3" fill="#8B4513"/>
        <rect x="-130" y="-3" width="20" height="6" rx="2" fill="#8B4513"/>
      </g>
      {/* Moon */}
      <circle cx="700" cy="50" r="38" fill="#fffde7" opacity="0.5"/>
      <circle cx="718" cy="40" r="30" fill="#0d1117" opacity="0.7"/>
    </svg>
  )
}

function DemonSlayerFlames(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="nightsky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#050520"/>
          <stop offset="100%" stopColor="#1a0530"/>
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#nightsky)"/>
      {/* Stars */}
      {Array.from({length:30},(_,i)=>(
        <circle key={i} cx={(i*73)%800} cy={(i*53)%120} r={i%4===0?2:1} fill="white" opacity={0.3+Math.sin(i)*0.3}/>
      ))}
      {/* Mountain silhouette */}
      <path d="M0,280 L0,180 L100,120 L200,160 L350,60 L500,150 L620,100 L750,140 L800,170 L800,280 Z" fill="#0d0d1a"/>
      {/* Water/river */}
      <path d="M0,260 Q200,240 400,260 Q600,280 800,255 L800,280 L0,280 Z" fill="#1a3a8f" opacity="0.6"/>
      {/* Water surface shine */}
      <path d="M50,265 Q150,255 250,265" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3"/>
      <path d="M400,270 Q500,260 600,270" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3"/>
      {/* Red/fire flames left */}
      {[-40,-20,0,20,40].map((dx,i)=>(
        <path key={i} d={`M${100+dx},280 Q${90+dx},200 ${100+dx},140 Q${115+dx},200 ${120+dx},280`}
          fill="url(#flame1)" opacity="0.6"/>
      ))}
      {/* Blue/water waves right */}
      {[-40,-20,0,20,40].map((dx,i)=>(
        <path key={i} d={`M${700+dx},280 Q${688+dx},210 ${700+dx},150 Q${712+dx},210 ${715+dx},280`}
          fill="#1e6be8" opacity="0.4"/>
      ))}
      <defs>
        <linearGradient id="flame1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF6B00"/>
          <stop offset="100%" stopColor="#FF0000"/>
        </linearGradient>
      </defs>
      {/* Cherry blossoms */}
      {[[300,80],[400,60],[500,75]].map(([x,y],i)=>(
        <g key={i}>
          {[0,72,144,216,288].map((a,j)=>(
            <ellipse key={j} cx={x+Math.cos(a*Math.PI/180)*10} cy={y+Math.sin(a*Math.PI/180)*10}
              rx="7" ry="5" fill="#ffb7c5" opacity="0.8" transform={`rotate(${a} ${x} ${y})`}/>
          ))}
        </g>
      ))}
    </svg>
  )
}

// ── 👑 Princess ──────────────────────────────────────────────────────────────

function PrincessCastle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="pinksky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff85a1"/>
          <stop offset="50%" stopColor="#da70d6"/>
          <stop offset="100%" stopColor="#c45ed4"/>
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#pinksky)"/>
      {/* Stars & sparkles */}
      {[[60,30],[180,50],[320,25],[500,40],[640,28],[740,50],[120,100],[680,110]].map(([x,y],i)=>(
        <text key={i} x={x} y={y} textAnchor="middle" fontSize={i%2===0?20:14} fill="#FFD700" opacity="0.8">✦</text>
      ))}
      {/* Fairy lights */}
      <path d="M0,15 Q100,5 200,18 Q300,30 400,14 Q500,0 600,16 Q700,30 800,14" fill="none" stroke="#FFD700" strokeWidth="1.5" opacity="0.5"/>
      {[0,80,160,240,320,400,480,560,640,720,800].map((x,i)=>(
        <circle key={i} cx={x} cy={15+Math.sin(i)*6} r="5" fill={['#FFD700','#FF69B4','#DA70D6','#87CEEB'][i%4]} opacity="0.8"/>
      ))}
      {/* Castle */}
      <g transform="translate(250,60)">
        {/* Main tower */}
        <rect x="100" y="80" width="100" height="130" fill="white" opacity="0.85"/>
        {/* Side towers */}
        <rect x="0" y="110" width="80" height="100" fill="white" opacity="0.8"/>
        <rect x="220" y="110" width="80" height="100" fill="white" opacity="0.8"/>
        {/* Tower tops - triangular roofs */}
        <path d="M140,80 L150,-5 L160,80 Z" fill="#C875C4"/>
        <path d="M100,80 L110,-5 L200,-5 L200,80 Z" fill="#da70d6" opacity="0.3"/>
        <path d="M30,110 L40,30 L50,110 Z" fill="#C875C4"/>
        <path d="M250,110 L260,30 L270,110 Z" fill="#C875C4"/>
        {/* Windows */}
        <rect x="135" y="110" width="30" height="40" rx="15" fill="#87CEEB" opacity="0.7"/>
        <rect x="25" y="135" width="30" height="30" rx="8" fill="#87CEEB" opacity="0.6"/>
        <rect x="245" y="135" width="30" height="30" rx="8" fill="#87CEEB" opacity="0.6"/>
        {/* Door */}
        <rect x="130" y="175" width="40" height="35" rx="20" fill="#C875C4" opacity="0.8"/>
        {/* Flag */}
        <rect x="148" y="-5" width="3" height="30" fill="#FFD700"/>
        <path d="M151,-5 L175,7 L151,19 Z" fill="#FFD700"/>
      </g>
      {/* Flowers ground */}
      {Array.from({length:16},(_,i)=>(
        <g key={i} transform={`translate(${i*50+10},262)`}>
          <line x1="0" y1="0" x2="0" y2="-20" stroke="#5a9e3a" strokeWidth="2"/>
          <circle cy="-22" r="7" fill={['#FF69B4','#FFD700','#DA70D6','#ff9eb5'][i%4]}/>
        </g>
      ))}
    </svg>
  )
}

function PrincessGold(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="goldbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8c8d4"/>
          <stop offset="50%" stopColor="#f0a0bb"/>
          <stop offset="100%" stopColor="#e07898"/>
        </linearGradient>
        <radialGradient id="goldglow" cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="280" fill="url(#goldbg)"/>
      <ellipse cx="400" cy="140" rx="300" ry="180" fill="url(#goldglow)"/>
      {/* Decorative diamond shapes */}
      {[[100,140],[700,140],[400,40],[400,240]].map(([x,y],i)=>(
        <path key={i} d={`M${x},${y-40} L${x+30},${y} L${x},${y+40} L${x-30},${y} Z`} fill="#FFD700" opacity="0.2"/>
      ))}
      {/* Crown */}
      <g transform="translate(400,120)">
        <path d="M-70,30 L-70,-15 L-35,20 L0,-30 L35,20 L70,-15 L70,30 Z" fill="#FFD700"/>
        <rect x="-70" y="26" width="140" height="22" rx="5" fill="#b8860b"/>
        {/* Gems */}
        <ellipse cx="-35" cy="0" rx="12" ry="10" fill="#ef4444"/>
        <ellipse cx="0" cy="-10" rx="12" ry="10" fill="#3b82f6"/>
        <ellipse cx="35" cy="0" rx="12" ry="10" fill="#10b981"/>
        {/* Crown shine */}
        <path d="M-60,10 Q-45,-8 -35,2" fill="none" stroke="white" strokeWidth="2.5" opacity="0.4"/>
        <path d="M30,-5 Q45,-15 58,5" fill="none" stroke="white" strokeWidth="2.5" opacity="0.4"/>
      </g>
      {/* Diamond gems scattered */}
      {[[80,60,12],[720,70,10],[150,210,8],[650,200,10],[400,30,9]].map(([x,y,s],i)=>(
        <path key={i} d={`M${x},${y-s} L${x+s*0.7},${y} L${x},${y+s} L${x-s*0.7},${y} Z`}
          fill={['#ef4444','#3b82f6','#10b981','#a855f7','#f59e0b'][i]} opacity="0.6"/>
      ))}
      {/* Stars */}
      {[[200,80],[600,90],[100,170],[700,160],[300,250],[500,245]].map(([x,y],i)=>(
        <text key={i} x={x} y={y} textAnchor="middle" fontSize="18" fill="#FFD700" opacity="0.7">★</text>
      ))}
    </svg>
  )
}

// ── 🦄 Unicorn ───────────────────────────────────────────────────────────────

function UnicornRainbow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="unibg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB3C6"/>
          <stop offset="33%" stopColor="#C9B3FF"/>
          <stop offset="66%" stopColor="#B3D9FF"/>
          <stop offset="100%" stopColor="#B3FFE4"/>
        </linearGradient>
      </defs>
      <rect width="800" height="280" fill="url(#unibg)"/>
      {/* Rainbow arc */}
      {['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#845EC2'].map((c,i)=>(
        <path key={i} d={`M${50+i*8},280 Q400,${-60+i*20} ${750-i*8},280`} fill="none" stroke={c} strokeWidth="18" opacity="0.35"/>
      ))}
      {/* Clouds */}
      {[[80,80],[620,60],[360,50]].map(([cx,cy],i)=>(
        <g key={i}>
          {[[-20,8],[0,0],[20,8],[40,10],[60,5],[80,10]].map(([dx,dy],j)=>(
            <circle key={j} cx={cx+dx} cy={cy+dy} r={18+j%2*6} fill="white" opacity="0.85"/>
          ))}
        </g>
      ))}
      {/* Unicorn silhouette */}
      <g transform="translate(400,110)">
        {/* Body */}
        <ellipse cx="0" cy="30" rx="65" ry="45" fill="white" opacity="0.9"/>
        {/* Head */}
        <circle cx="55" cy="-5" r="35" fill="white" opacity="0.9"/>
        {/* Horn */}
        <path d="M65,-40 L72,-75 L79,-40 Z" fill="#FFD700"/>
        <path d="M67,-40 L72,-75 L77,-40" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.4"/>
        {/* Eye */}
        <circle cx="68" cy="-8" r="6" fill="#5b21b6"/>
        <circle cx="70" cy="-10" r="2.5" fill="white"/>
        {/* Mane */}
        <path d="M35,-38 Q20,-55 25,-70 Q35,-55 45,-65 Q50,-50 55,-38" fill="#ff85a1" opacity="0.8"/>
        <path d="M30,-35 Q15,-52 20,-67 Q30,-52 40,-62 Q45,-47 50,-35" fill="#C9B3FF" opacity="0.7"/>
        {/* Legs */}
        {[-40,-15,15,40].map((x,i)=>(
          <rect key={i} x={x-8} y="70" width="16" height="50" rx="7" fill="white" opacity="0.85"/>
        ))}
        {/* Tail */}
        <path d="M-65,20 Q-90,50 -80,80 Q-85,60 -75,40" fill="none" stroke="#ff85a1" strokeWidth="14" strokeLinecap="round"/>
        <path d="M-65,20 Q-95,55 -82,85" fill="none" stroke="#C9B3FF" strokeWidth="10" strokeLinecap="round"/>
      </g>
      {/* Stars & sparkles */}
      {[[100,40],[700,45],[200,200],[600,195],[50,140],[750,145]].map(([x,y],i)=>(
        <text key={i} x={x} y={y} textAnchor="middle" fontSize={i%2===0?22:16} fill="#a855f7" opacity="0.6">✦</text>
      ))}
    </svg>
  )
}

function UnicornMagic(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 800 280" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="magicbg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2d1b69"/>
          <stop offset="100%" stopColor="#11003b"/>
        </linearGradient>
        <radialGradient id="magicglow1" cx="30%" cy="50%" r="35%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="magicglow2" cx="70%" cy="50%" r="35%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="280" fill="url(#magicbg)"/>
      <rect width="800" height="280" fill="url(#magicglow1)"/>
      <rect width="800" height="280" fill="url(#magicglow2)"/>
      {/* Stars */}
      {Array.from({length:40},(_,i)=>(
        <circle key={i} cx={(i*79+23)%800} cy={(i*53+17)%200} r={i%5===0?3:1.5} fill="white" opacity={0.2+i%4*0.15}/>
      ))}
      {/* Magic wand */}
      <g transform="translate(200,140)">
        <rect x="-5" y="-80" width="10" height="120" rx="4" fill="#C9B3FF" transform="rotate(-30)"/>
        <path d="M-22,-94 L0,-115 L22,-94 L6,-72 L-6,-72 Z" fill="#FFD700"/>
        {/* Sparkle trails */}
        {[[30,-60,'#ff85a1'],[55,-30,'#FFD700'],[70,10,'#C9B3FF'],[50,45,'#87CEEB']].map(([x,y,c],i)=>(
          <text key={i} x={x} y={y} fontSize="16" fill={c as string} opacity="0.8">✦</text>
        ))}
      </g>
      {/* Large sparkle center */}
      <g transform="translate(400,130)">
        {[0,45,90,135].map(a=>(
          <line key={a} x1="0" y1="0" x2={Math.cos(a*Math.PI/180)*55} y2={Math.sin(a*Math.PI/180)*55} stroke="#FFD700" strokeWidth="3" opacity="0.7"/>
        ))}
        {[0,45,90,135].map(a=>(
          <line key={a} x1="0" y1="0" x2={-Math.cos(a*Math.PI/180)*55} y2={-Math.sin(a*Math.PI/180)*55} stroke="#FFD700" strokeWidth="3" opacity="0.7"/>
        ))}
        <circle r="18" fill="#FFD700"/>
        <circle r="12" fill="white"/>
      </g>
      {/* Rainbow letters */}
      {['🦄','🌈','✨','💜','🌟'].map((e,i)=>(
        <text key={i} x={130+i*130} y={240} textAnchor="middle" fontSize="28">{e}</text>
      ))}
    </svg>
  )
}

// ── Registry ─────────────────────────────────────────────────────────────────

export const BANNERS: BannerMeta[] = [
  { id: 'birthday-confetti', templateId: 'birthday',    name: 'Confetti',      Component: BirthdayConfetti },
  { id: 'birthday-gold',     templateId: 'birthday',    name: 'Gold & Stars',  Component: BirthdayGold },
  { id: 'minions-banana',    templateId: 'minions',     name: 'Banana Party',  Component: MinionsBanana },
  { id: 'minions-party',     templateId: 'minions',     name: 'Minion Face',   Component: MinionsParty },
  { id: 'spiderman-web',     templateId: 'spiderman',   name: 'Web Hero',      Component: SpidermanWeb },
  { id: 'spiderman-city',    templateId: 'spiderman',   name: 'Night City',    Component: SpidermanCity },
  { id: 'minecraft-land',    templateId: 'minecraft',   name: 'Landscape',     Component: MinecraftLandscape },
  { id: 'minecraft-cave',    templateId: 'minecraft',   name: 'Diamond Cave',  Component: MinecraftCave },
  { id: 'roblox-game',       templateId: 'roblox',      name: 'Game On',       Component: RobloxGame },
  { id: 'roblox-noob',       templateId: 'roblox',      name: 'Party Noob',    Component: RobloxNoob },
  { id: 'ds-checker',        templateId: 'demonslayer', name: 'Haori Pattern', Component: DemonSlayerCheckerboard },
  { id: 'ds-flames',         templateId: 'demonslayer', name: 'Night Battle',  Component: DemonSlayerFlames },
  { id: 'princess-castle',   templateId: 'princess',    name: 'Royal Castle',  Component: PrincessCastle },
  { id: 'princess-gold',     templateId: 'princess',    name: 'Gold Crown',    Component: PrincessGold },
  { id: 'unicorn-rainbow',   templateId: 'unicorn',     name: 'Rainbow',       Component: UnicornRainbow },
  { id: 'unicorn-magic',     templateId: 'unicorn',     name: 'Magic Night',   Component: UnicornMagic },
]

export function getBannersForTemplate(templateId: string): BannerMeta[] {
  return BANNERS.filter(b => b.templateId === templateId)
}

export function getBanner(id: string | null | undefined): BannerMeta | undefined {
  return BANNERS.find(b => b.id === id)
}
