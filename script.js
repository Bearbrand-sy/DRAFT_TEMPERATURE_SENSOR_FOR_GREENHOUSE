// Navigation
function showSection(sectionId){
  const sections=['monitoring','dataLogs','graphs'];
  sections.forEach(id=>document.getElementById(id).style.display='none');
  document.getElementById(sectionId).style.display='block';
  document.querySelectorAll('.sidebar button').forEach(btn=>btn.classList.remove('active'));
  document.querySelector(`.sidebar button[onclick="showSection('${sectionId}')"]`).classList.add('active');
}

// Logout
function logout(){ if(confirm("Are you sure you want to logout?")) window.location.href="index.html"; }

// Filter Logs
function filterLogs(){
  const filter=document.getElementById("logSelect").value;
  document.querySelectorAll("#logBody tr").forEach(row=>row.style.display=(row.dataset.logtype===filter?"":"none"));
}

// Generate CSV
function generateReport(){
  const button=document.getElementById("generateReport");
  button.innerHTML='Generating...'; button.disabled=true;
  setTimeout(()=>{
    const filter=document.getElementById("logSelect").value;
    const table=document.getElementById("logTable"); let csv=[];
    let headerRow=[]; for(let j=0;j<table.rows[0].cells.length;j++) headerRow.push(table.rows[0].cells[j].innerText);
    csv.push(headerRow.join(","));
    const rows=document.querySelectorAll("#logBody tr");
    rows.forEach(row=>{ if(row.dataset.logtype===filter){
      let dataRow=[]; for(let j=0;j<row.cells.length;j++) dataRow.push(row.cells[j].innerText.trim());
      csv.push(dataRow.join(","));
    }});
    const blob=new Blob([csv.join("\n")],{type:'text/csv'});
    const url=window.URL.createObjectURL(blob); const a=document.createElement('a');
    a.href=url; a.download=`greenhouse_${filter}_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    button.innerHTML='✓ Report Generated!';
    setTimeout(()=>{button.innerHTML='📊 Generate Report'; button.disabled=false;},2000);
  },1000);
}

// Chart.js Graph
const ctx=document.getElementById('graphContainer').getContext('2d');
const chart=new Chart(ctx,{
  type:'line',
  data:{
    labels:['09:00','09:30','10:00','10:30','11:00'],
    datasets:[
      { label:'Temperature (°C)', data:[25.8,26.4,26.5,26.7,27.0], borderColor:'#667eea', fill:false, tension:0.3 },
      { label:'Humidity (%)', data:[72,65,68,70,69], borderColor:'#38ef7d', fill:false, tension:0.3 }
    ]
  },
  options:{ responsive:true, plugins:{legend:{position:'top'}}, scales:{y:{beginAtZero:false}} }
});

// Irrigation buttons toggle
function toggleIrrigation(btn){
  document.querySelectorAll('.irrigation-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  alert(`${btn.innerText} Irrigation Activated`);
}

// Initialize daily logs
window.onload=filterLogs;