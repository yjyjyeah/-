/* 训练计划数据 · 来源：三分化.md（Push / Pull / Legs）
   规则：每个训练日 16–18 个有效组左右，80 分钟刚好。 */
const EXERCISES = {
  bench_press:{id:'bench_press',name:'杠铃卧推',en:'Barbell Bench Press',sets:4,min:6,max:10,rir:'2',rest:180,increment:2.5,unit:'kg',priority:true,note:'最重要的动作'},
  incline_db_press:{id:'incline_db_press',name:'上斜哑铃卧推',en:'Incline Dumbbell Press',sets:3,min:8,max:12,rir:'2',rest:120,increment:2.5,unit:'kg'},
  seated_shoulder_press:{id:'seated_shoulder_press',name:'坐姿推肩',en:'Seated Shoulder Press',sets:3,min:10,max:15,rir:'2',rest:120,increment:2.5,unit:'kg'},
  lateral_raise:{id:'lateral_raise',name:'哑铃侧平举',en:'Dumbbell Lateral Raise',sets:3,min:12,max:20,rir:'1–2',rest:75,increment:2,unit:'kg'},
  triceps_pushdown:{id:'triceps_pushdown',name:'绳索下压',en:'Triceps Pushdown',sets:3,min:10,max:15,rir:'1–2',rest:75,increment:2.5,unit:'kg'},
  overhead_extension:{id:'overhead_extension',name:'过顶臂屈伸',en:'Overhead Triceps Extension',sets:2,min:12,max:15,rir:'1–2',rest:75,increment:2.5,unit:'kg'},
  assisted_pullup:{id:'assisted_pullup',name:'辅助引体',en:'Assisted Pull-up',sets:4,min:8,max:12,rir:'2',rest:150,increment:5,unit:'kg',priority:true,assistance:true},
  chest_supported_row:{id:'chest_supported_row',name:'胸托划船',en:'Chest Supported Row',sets:4,min:8,max:12,rir:'2',rest:120,increment:2.5,unit:'kg'},
  lat_pulldown:{id:'lat_pulldown',name:'高位下拉',en:'Lat Pulldown',sets:3,min:10,max:12,rir:'2',rest:120,increment:5,unit:'kg'},
  seated_row:{id:'seated_row',name:'坐姿划船',en:'Seated Cable Row',sets:2,min:12,max:15,rir:'1–2',rest:120,increment:5,unit:'kg'},
  face_pull:{id:'face_pull',name:'面拉',en:'Face Pull',sets:3,min:15,max:20,rir:'1–2',rest:75,increment:2.5,unit:'kg'},
  barbell_curl:{id:'barbell_curl',name:'杠铃弯举',en:'Barbell Curl',sets:3,min:8,max:12,rir:'1–2',rest:90,increment:2.5,unit:'kg'},
  hammer_curl:{id:'hammer_curl',name:'锤式弯举',en:'Hammer Curl',sets:2,min:12,max:15,rir:'1–2',rest:75,increment:2,unit:'kg'},
  hack_squat:{id:'hack_squat',name:'哈克深蹲',en:'Hack Squat',sets:4,min:8,max:12,rir:'2',rest:180,increment:2.5,unit:'kg',priority:true},
  romanian_deadlift:{id:'romanian_deadlift',name:'罗马尼亚硬拉',en:'Romanian Deadlift',sets:3,min:8,max:10,rir:'2',rest:150,increment:2.5,unit:'kg'},
  leg_press:{id:'leg_press',name:'腿举',en:'Leg Press',sets:3,min:10,max:15,rir:'2',rest:120,increment:5,unit:'kg'},
  seated_leg_curl:{id:'seated_leg_curl',name:'坐姿腿弯举',en:'Seated Leg Curl',sets:3,min:10,max:15,rir:'1–2',rest:90,increment:2.5,unit:'kg'},
  leg_extension:{id:'leg_extension',name:'腿屈伸',en:'Leg Extension',sets:2,min:12,max:15,rir:'1–2',rest:75,increment:2.5,unit:'kg'},
  calf_raise:{id:'calf_raise',name:'小腿',en:'Calf Raise',sets:4,min:12,max:20,rir:'1–2',rest:75,increment:5,unit:'kg'},
  core:{id:'core',name:'核心',en:'Core',sets:3,min:10,max:15,rir:'1–2',rest:75,increment:0,unit:'次'}
};
const WORKOUTS = {
  push:{id:'push',name:'Push',cn:'推 · 胸肩三头',focus:'卧推重点',duration:'80 min',exercises:['bench_press','incline_db_press','seated_shoulder_press','lateral_raise','triceps_pushdown','overhead_extension']},
  pull:{id:'pull',name:'Pull',cn:'拉 · 背与二头',focus:'引体重点',duration:'80 min',exercises:['assisted_pullup','chest_supported_row','lat_pulldown','seated_row','face_pull','barbell_curl','hammer_curl']},
  legs:{id:'legs',name:'Legs',cn:'腿 · 下肢与核心',focus:'哈克深蹲重点',duration:'80 min',exercises:['hack_squat','romanian_deadlift','leg_press','seated_leg_curl','leg_extension','calf_raise','core']}
};
const WORKOUT_ORDER = ['push','pull','legs'];
const DAY_ORDER = ['周一','周二','周三','周四','周五','周六','周日'];
/* 训练日固定在周一、周二、周四、周六、周日（周三 / 周五休息），每周 5 练；
   每天一个动作日、按 Push → Pull → Legs 逐日推进，周一的动作每周顺延 2 位。
   这与三分化.md 给出的两周排期一致：
     第 1 周 一推 二拉 三休 四腿 五休 六推 日拉
     第 2 周 一腿 二推 三休 四拉 五休 六推 日拉
   三大项不会永远固定在星期几。 */
const DAY_REST = [false, false, true, false, true, false, false];
const TRAINING_DAYS_PER_WEEK = 5;
function trainingDays(){return TRAINING_DAYS_PER_WEEK}
function dayPlansForWeek(week){
  const start=(2*(week-1))%WORKOUT_ORDER.length; // 本周周一在 PPL 轮转中的位置
  const plan=[];
  for(let i=0;i<DAY_REST.length;i++){
    if(DAY_REST[i]){plan.push('rest');continue}
    const nth=plan.filter(x=>x!=='rest').length; // 本周第几个训练日
    plan.push(WORKOUT_ORDER[(start+nth)%WORKOUT_ORDER.length]);
  }
  return plan;
}
const PHASES = [{from:1,to:2,name:'建立基准',short:'BASELINE PHASE',desc:'找到合适训练重量，保持 RIR 3。'},{from:3,to:6,name:'第一积累期',short:'BUILD PHASE',desc:'增加次数与重量，保持动作质量。'},{from:7,to:7,name:'减载周',short:'DELOAD',desc:'训练量减半，重量下调，RIR 4–5。'},{from:8,to:13,name:'第二积累期',short:'BUILD PHASE',desc:'稳步推进，积累训练容量。'},{from:14,to:14,name:'减载周',short:'DELOAD',desc:'恢复身体，为力量期做准备。'},{from:15,to:20,name:'力量偏重期',short:'STRENGTH PHASE',desc:'更高强度，更长休息。'},{from:21,to:21,name:'减载周',short:'DELOAD',desc:'训练量减半，保持动作。'},{from:22,to:25,name:'最终积累',short:'FINAL BUILD',desc:'完成最后一轮渐进超负荷。'},{from:26,to:26,name:'评估周',short:'ASSESSMENT',desc:'复盘半年变化，设定下一周期。'}];
const key = 'training-recomp-v1';
const OLD_STORAGE_KEY = 'training-recomp-v1';
/* 四分化（Upper/Lower）→ 三分化（Push/Pull/Legs）的历史记录映射 */
const LEGACY_WORKOUT_MAP = {upper_a:'push',lower_a:'legs',upper_b:'pull',lower_b:'legs'};
const defaultState = {week:3,weekSessionCount:0,nextWorkoutIndex:1,nextWorkoutId:null,bodyLogs:[{date:'09/20',weight:60.2,waist:78.5},{date:'09/21',weight:60.0,waist:78.2},{date:'09/22',weight:59.9,waist:78.0},{date:'09/23',weight:59.8,waist:77.8},{date:'09/24',weight:59.9,waist:77.7},{date:'09/25',weight:59.8,waist:77.5}],workoutLogs:[],sessions:[],restLogs:[],completedWorkouts:[],habits:{}};
let state = loadState();
let currentWorkoutId = getNextWorkout().id;
let session = null;
let timerInterval = null;
let workoutStart = null;

function migrateState(saved){
  const merged = {...defaultState,...(saved||{})};
  let changed = false;
  const mapId = id => LEGACY_WORKOUT_MAP[id] || id;
  (merged.workoutLogs||[]).forEach(log=>{const next=mapId(log.workout);if(next!==log.workout){log.workout=next;changed=true}});
  (merged.sessions||[]).forEach(s=>{const next=mapId(s.workout);if(next!==s.workout){s.workout=next;changed=true}});
  if(merged.nextWorkoutId&&!WORKOUTS[merged.nextWorkoutId]){merged.nextWorkoutId=null;changed=true}
  if(typeof merged.nextWorkoutId!=='string')merged.nextWorkoutId=null;
  return {state:merged,changed};
}
function loadState(){
  try{
    let saved = JSON.parse(localStorage.getItem(key)||'null');
    if(!saved){try{saved=JSON.parse(localStorage.getItem(OLD_STORAGE_KEY)||'null')}catch{saved=null}}
    if(!saved||typeof saved!=='object')return {...defaultState};
    let merged,changed;
    try{({state:merged,changed}=migrateState(saved));}
    catch{merged={...defaultState,...saved};changed=false} // 迁移失败时至少保留原始记录，绝不吞掉历史
    if(!Array.isArray(merged.sessions))merged.sessions=(merged.workoutLogs||[]).map((log,index)=>({date:log.date,workout:log.workout,sequence:index+1,week:merged.week||3}));
    if(!Array.isArray(merged.restLogs))merged.restLogs=[];
    if(typeof merged.nextWorkoutIndex!=='number')merged.nextWorkoutIndex=merged.sessions.length%WORKOUT_ORDER.length;
    if(typeof merged.weekSessionCount!=='number')merged.weekSessionCount=merged.sessions.filter(s=>s.week===merged.week).length%trainingDays();
    if(changed)localStorage.setItem(key,JSON.stringify(merged));
    return merged;
  }catch{return {...defaultState}}
}
function saveState(){localStorage.setItem(key,JSON.stringify(state))}
function qs(selector){return document.querySelector(selector)}
function isoDate(date=new Date()){const y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),d=String(date.getDate()).padStart(2,'0');return `${y}-${m}-${d}`}
function formatDate(){const d=new Date();return `${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getDate()).padStart(2,'0')}`}
function formatSessionDate(date){if(!date)return '';const [y,m,d]=date.split('-');return `${m}/${d}`}
function getNextWorkout(){
  /* 本周星期几的安排是唯一事实来源：完成次数落后/超前时自动对齐到本周下一个训练日；
     若已显式记录了下一次动作（例如你手动选择了别的训练日），则优先采用它。 */
  const explicit=state.nextWorkoutId&&WORKOUTS[state.nextWorkoutId]?state.nextWorkoutId:null;
  const dayIndex=nextDayIndex();
  return WORKOUTS[explicit||weekPlan(state.week)[dayIndex]||WORKOUT_ORDER[0]];
}
/* 把轮转位置对齐到“第 state.week 周的下一个训练日”，
   保证开始训练 / 完成训练后显示的永远是连续轮转中的下一个动作。 */
function syncRotation(){state.nextWorkoutIndex=Math.max(0,WORKOUT_ORDER.indexOf(weekPlan(state.week)[nextDayIndex()]));state.nextWorkoutId=null}
/* 本周每天的安排：训练日返回动作日 id，休息日返回 'rest'。 */
function weekPlan(week){return dayPlansForWeek(week)}
/* 本周下一个训练日是周几：从已完成的次数往后找第一个训练日。 */
function nextDayIndex(){const plan=weekPlan(state.week);for(let k=Math.min(state.weekSessionCount,trainingDays()-1);k<plan.length;k++){if(plan[k]!=='rest')return k}return 0}
function getSessionCount(){return Array.isArray(state.sessions)?state.sessions.length:state.workoutLogs.length}
function getPhase(){return PHASES.find(p=>state.week>=p.from&&state.week<=p.to)||PHASES[1]}
function weekWorkoutIds(week){return weekPlan(week)}
function getLastLog(exerciseId,workoutId=currentWorkoutId){return [...state.workoutLogs].reverse().find(log=>log.workout===workoutId&&log.exercises?.some(e=>e.exercise===exerciseId))?.exercises.find(e=>e.exercise===exerciseId)}
function recommendation(exercise,last){
  const base=last?.sets?.length?Number(last.sets[0].weight)||0:suggestedBase(exercise.id);
  if(!last)return {weight:base,text:`建议从 ${base||'自重'} ${exercise.unit==='次'?'':'开始'}`.trim()};
  const reps=last.sets.map(s=>Number(s.reps)||0);
  const topReps=Math.max(exercise.min,exercise.max-2);
  const allTop=reps.length>=exercise.sets&&reps.every(r=>r>=topReps);
  const total=reps.reduce((a,b)=>a+b,0);
  const step=exercise.increment>0?exercise.increment:2.5;
  if(exercise.assistance&&allTop)return {weight:Math.max(0,roundWeight(base-step)),text:`已完成 ${exercise.sets}×${topReps}，减少 ${exercise.increment} kg 辅助 → ${Math.max(0,roundWeight(base-step))} kg`};
  if(exercise.increment>0&&reps.length>=exercise.sets&&reps.every(r=>r>=exercise.max))return {weight:roundWeight(base+step),text:`上次已达上限，建议加重至 ${roundWeight(base+step)} kg`};
  if(allTop)return {weight:base,text:`继续 ${base} kg · 下次目标 总次数 ≥ ${total+1}`};
  return {weight:base,text:`继续 ${base} kg · 下次目标 总次数 > ${total}`};
}
function suggestedBase(id){const map={bench_press:35,incline_db_press:15,seated_shoulder_press:20,lateral_raise:7.5,triceps_pushdown:25,overhead_extension:15,assisted_pullup:30,chest_supported_row:35,lat_pulldown:35,seated_row:35,face_pull:20,barbell_curl:15,hammer_curl:10,hack_squat:50,romanian_deadlift:40,leg_press:80,seated_leg_curl:30,leg_extension:25,calf_raise:40,core:0};return map[id]??20}
function roundWeight(n){return Math.round(n*2)/2}
function phaseIsDeload(){return getPhase().short==='DELOAD'}
/* 减载周：4组→2组、3组→2组、2组→1组，RIR 4–5，次数区间下调。 */
function effectiveExercise(ex){if(!phaseIsDeload())return ex;return {...ex,sets:Math.max(1,Math.ceil(ex.sets/2)),min:Math.max(5,ex.min-2),max:Math.max(6,ex.max-2),rir:'4–5'}}
function weightLabel(ex,value){return ex.unit==='次'||Number(value)===0?'自重':`${value} kg`}

function init(){
  syncRotation();saveState();
  const phase=getPhase();
  qs('#current-week').textContent=state.week;qs('#week-progress').textContent=`${Math.round(state.week/26*100)}%`;qs('.week-ring').style.background=`conic-gradient(var(--lime) 0 ${state.week/26*100}%,#2b3530 ${state.week/26*100}% 100%)`;
  qs('#phase-label').textContent=`${phase.name} · ${phase.short}`;qs('#today-date').textContent=formatDate();
  renderHome();renderPlan();renderProgress();bindNavigation();bindModal();
  if('serviceWorker' in navigator)navigator.serviceWorker.register('service-worker.js').catch(()=>{});
}
function mondayOfWeek(date=new Date()){const d=new Date(date);const shift=(d.getDay()+6)%7;d.setDate(d.getDate()-shift);return d}
function renderHome(){
  const phase=getPhase();qs('#current-week').textContent=state.week;qs('#week-progress').textContent=`${Math.round(state.week/26*100)}%`;qs('.week-ring').style.background=`conic-gradient(var(--lime) 0 ${state.week/26*100}%,#2b3530 ${state.week/26*100}% 100%)`;qs('#phase-label').textContent=`${phase.name} · ${phase.short}`;
  const next=getNextWorkout();currentWorkoutId=next.id;qs('#today-name').textContent=`${next.name} · ${next.cn}`;qs('#today-focus').textContent=`${next.focus} · ${next.exercises.length} 个动作`;
  const weeklySets=next.exercises.reduce((sum,id)=>sum+(effectiveExercise(EXERCISES[id]).sets),0);
  const dayIndex=nextDayIndex();const monday=mondayOfWeek();const nextDate=new Date(monday);nextDate.setDate(monday.getDate()+dayIndex);
  const dayLabel=DAY_ORDER[dayIndex]||'';const whenLabel=isoDate(nextDate)===isoDate()?'今天 · ':dayLabel;const nextDateLabel=formatSessionDate(isoDate(nextDate));
  qs('#today-card .today-meta').innerHTML=`<span>${whenLabel}${nextDateLabel}</span><span>约 ${next.duration.replace(' min','')} min</span><span>${weeklySets} 个有效组</span><span>RIR ${phaseIsDeload()?'4–5':'2'}</span>`;
  qs('#today-date').textContent=`· 今天 ${formatDate()}`;
  const latest=state.bodyLogs.at(-1);if(latest)qs('#home-weight').innerHTML=`${latest.weight.toFixed(1)} <i>kg</i>`;
  qs('#start-today').innerHTML=`开始 ${next.name} 训练 <span>→</span>`;qs('#start-today').onclick=()=>openWorkout(next.id);
  const sessionsThisWeek=state.sessions.filter(s=>s.week===state.week).length;qs('#week-done-count').textContent=`${sessionsThisWeek} / ${trainingDays()} 次完成`;
  renderSchedule(next);
  qs('#workout-choices').innerHTML=WORKOUT_ORDER.map(id=>{const w=WORKOUTS[id];const doneToday=state.sessions.some(s=>s.date===isoDate()&&s.workout===id);return `<button class="choice-btn ${id===next.id?'next-choice':''} ${doneToday?'done-choice':''}" data-choice="${id}"><strong>${w.name}</strong><small>${w.cn}</small><small class="choice-meta">${w.focus} · ${w.exercises.length} 个动作</small></button>`}).join('');qs('#workout-choices').querySelectorAll('[data-choice]').forEach(btn=>btn.onclick=()=>openWorkout(btn.dataset.choice));qs('#rest-today').onclick=markRestToday;
  const last=getLastLog('bench_press','push');const rec=recommendation(EXERCISES.bench_press,last);qs('#next-step').innerHTML=last?`卧推 · ${rec.text}`:`完成第一次 Push 训练后，这里会告诉你下一次的建议重量。`;
}
function renderSchedule(next){
  const weekIds=weekWorkoutIds(state.week);const todayIso=isoDate();const monday=mondayOfWeek();
  const list=qs('#schedule-list');
  list.innerHTML=DAY_ORDER.map((label,i)=>{
    const dayDate=new Date(monday);dayDate.setDate(monday.getDate()+i);
    const dateIso=isoDate(dayDate);
    const workoutId=weekIds[i];
    const done=state.sessions.some(s=>s.date===dateIso);
    const rest=state.restLogs.some(s=>s.date===dateIso);
    const isNext=workoutId===next.id;
    const isToday=dateIso===todayIso;
    if(workoutId==='rest'){
      return `<div class="schedule-row rest ${isToday?'today-row':''}"><span class="day">${label}</span><span class="workout">休息日<small class="focus">9000+ 步 · 正常饮食 · 保证睡眠</small></span><span class="status">${rest?'✓':''}</span></div>`;
    }
    const w=WORKOUTS[workoutId];
    const status=done?'✓':isNext?'→':'';
    return `<div class="schedule-row ${done?'done':''} ${isNext?'next':''} ${isToday?'today-row':''}" data-open="${workoutId}"><span class="day">${label}${isToday?'<i class="today-dot"></i>':''}</span><span class="workout">${w.name}<small class="focus">${w.focus} · ${formatSessionDate(dateIso)}</small></span><span class="status">${status}</span></div>`;
  }).join('');
  list.querySelectorAll('[data-open]').forEach(row=>row.onclick=()=>openWorkout(row.dataset.open));
}
function openWorkout(workoutId){currentWorkoutId=workoutId;session={};workoutStart=Date.now();renderWorkout();switchView('workout')}
function renderWorkout(){const workout=WORKOUTS[currentWorkoutId];qs('#workout-title').textContent=`${workout.name} · ${workout.cn}`;qs('#workout-subtitle').textContent=`${workout.focus} · Week ${state.week}`;session=session||{};const list=qs('#exercise-list');list.innerHTML=workout.exercises.map(id=>renderExercise(EXERCISES[id])).join('');updateWorkoutProgress();}
function renderExercise(raw){const ex=effectiveExercise(raw),last=getLastLog(raw.id),rec=recommendation(raw,last),saved=session[raw.id]||Array.from({length:ex.sets},()=>({weight:rec.weight,reps:last?.sets?.[0]?.reps||'',rir:raw.rir,done:false}));session[raw.id]=saved;const allDone=saved.length>0&&saved.every(s=>s.done);const lastLabel=last?`上次 · ${last.sets.map(s=>s.reps||'–').join(' / ')} · ${weightLabel(raw,last.sets[0]?.weight)}`:'';return `<article class="exercise-card ${allDone?'completed':''}" data-exercise="${raw.id}"><div class="exercise-top"><div class="exercise-title"><h2>${raw.name}${raw.priority?' <span class="star">⭐</span>':''}</h2><p>${raw.en}</p></div><span class="exercise-tag">${ex.sets} × ${ex.min}–${ex.max}</span></div><div class="exercise-details"><span>目标 <strong>${ex.sets} × ${ex.min}–${ex.max}</strong></span><span>RIR <strong>${ex.rir}</strong></span><span>休息 <strong>${ex.rest}s</strong></span></div>${last?`<div class="last-performance"><span>${lastLabel}</span><strong>${weightLabel(raw,last.sets[0]?.weight)}</strong></div>`:''}<div class="recommendation"><span>RECOMMENDED</span><strong>${rec.text}</strong></div><div class="set-head"><span>SET</span><span>WEIGHT</span><span>REPS</span><span>RIR</span><span></span></div><div class="sets-table">${saved.map((set,i)=>`<div class="set-row ${set.done?'done':''}" data-set="${i}"><span>${i+1}</span><input data-field="weight" type="number" step="0.5" value="${set.weight??''}" aria-label="重量"><input data-field="reps" type="number" min="0" value="${set.reps??''}" aria-label="次数"><input data-field="rir" type="number" min="0" max="5" value="${set.rir??''}" aria-label="RIR"><button class="set-done" aria-label="完成第 ${i+1} 组">${set.done?'✓':'○'}</button></div>`).join('')}</div><div class="rest-hint">每组完成后点击 <b>○</b>，自动开始休息计时</div></article>`}
function bindWorkoutEvents(){qs('#exercise-list').querySelectorAll('.exercise-card').forEach(card=>{const id=card.dataset.exercise;card.querySelectorAll('input').forEach(input=>input.addEventListener('input',()=>{const row=input.closest('.set-row');const i=Number(row.dataset.set);session[id][i][input.dataset.field]=input.value;saveState()}));card.querySelectorAll('.set-done').forEach(btn=>btn.addEventListener('click',()=>{const row=btn.closest('.set-row');const i=Number(row.dataset.set);session[id][i].done=!session[id][i].done;if(session[id][i].done){startRest(EXERCISES[id].rest);showToast('已记录，开始休息');}renderWorkout();bindWorkoutEvents();}));});}
function updateWorkoutProgress(){const workout=WORKOUTS[currentWorkoutId];let complete=0;workout.exercises.forEach(id=>{if(session?.[id]?.length&&session[id].every(s=>s.done))complete++});qs('#exercise-progress-text').textContent=`${complete} / ${workout.exercises.length} 动作`;qs('#exercise-progress-bar').style.width=`${complete/workout.exercises.length*100}%`;if(workoutStart){const sec=Math.floor((Date.now()-workoutStart)/1000);qs('#workout-elapsed').textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`}}
function finishWorkout(){const workout=WORKOUTS[currentWorkoutId];const exercises=workout.exercises.map(id=>({exercise:id,sets:(session[id]||[]).map(s=>({weight:Number(s.weight)||0,reps:Number(s.reps)||0,rir:Number(s.rir)||0}))})).filter(e=>e.sets.some(s=>s.reps>0));if(!exercises.length){showToast('先记录至少一组训练');return}const date=isoDate();const sequence=getSessionCount()+1;const log={date,workout:currentWorkoutId,exercises};state.workoutLogs.push(log);state.sessions.push({date,workout:currentWorkoutId,sequence,week:state.week});
  // 三分化循环：Push → Pull → Legs 不断轮转，练完本周 5 个训练日进入下一周。
  state.weekSessionCount=(state.weekSessionCount||0)+1;
  if(state.weekSessionCount>=trainingDays()&&state.week<26){state.week+=1;state.weekSessionCount=0}
  syncRotation();
  saveState();showToast('训练已保存 · 下一次已按 Push → Pull → Legs 排好');renderHome();renderPlan();setTimeout(()=>switchView('home'),700)}
function markRestToday(){const date=isoDate();if(!state.restLogs.some(log=>log.date===date))state.restLogs.push({date});saveState();renderHome();renderPlan();showToast('已记录今天休息，下一次训练保留')}
function startRest(seconds){clearInterval(timerInterval);let remaining=seconds;qs('#rest-timer').hidden=false;const tick=()=>{qs('#timer-display').textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;if(remaining<=0){clearInterval(timerInterval);showToast('休息结束，准备下一组');qs('#rest-timer').hidden=true}remaining--};tick();timerInterval=setInterval(tick,1000)}
function renderProgress(){const logs=state.bodyLogs;const weight=logs.at(-1)?.weight||60;qs('#chart-value').innerHTML=`${weight.toFixed(1)} <i>kg</i>`;renderChart('weight');renderStrength();}
function renderChart(metric){const logs=state.bodyLogs;const values=logs.length?logs.map(l=>metric==='waist'?l.waist:l.weight):[60];const min=Math.min(...values),max=Math.max(...values),range=max-min||1;qs('#progress-chart').innerHTML=values.map(v=>`<span class="chart-bar" style="height:${22+(v-min)/range*70}%" title="${v}"></span>`).join('');qs('#chart-labels').innerHTML=values.map((_,i)=>`<span>${logs[i]?.date||''}</span>`).join('');const recent=values.slice(-7);const avg=recent.reduce((a,b)=>a+b,0)/recent.length;if(metric==='waist'){qs('#chart-kicker').textContent='WAIST TREND · 腰围趋势';qs('#chart-value').innerHTML=`${values.at(-1).toFixed(1)} <i>cm</i>`;qs('#trend-badge').textContent=values.at(-1)<=values[0]?'下降':'观察';}else{qs('#chart-kicker').textContent=`7-DAY AVERAGE · 近 ${recent.length} 次均值`;qs('#chart-value').innerHTML=`${avg.toFixed(1)} <i>kg</i>`;qs('#trend-badge').textContent=values.at(-1)<=values[0]?'稳定':'观察'}}
function renderStrength(){const ids=['bench_press','assisted_pullup','hack_squat','seated_shoulder_press','chest_supported_row'];qs('#strength-list').innerHTML=ids.map(id=>{const ex=EXERCISES[id],logs=state.workoutLogs.flatMap(l=>l.exercises||[]).filter(e=>e.exercise===id),last=logs.at(-1);return `<div class="strength-row"><div class="name">${ex.name}${ex.priority?' ⭐':''}<small>${last?'最近训练':'等待第一次记录'}</small></div><strong>${last?`${last.sets[0].weight?last.sets[0].weight+' kg':'自重'} × ${last.sets[0].reps}`:'—'}</strong></div>`}).join('')}
function saveBodyLog(){const weight=Number(qs('#weight-input').value),waist=Number(qs('#waist-input').value);if(!weight&&!waist){showToast('请输入体重或腰围');return}const prev=state.bodyLogs.at(-1)||{};state.bodyLogs.push({date:formatDate(),weight:weight||prev.weight||60,waist:waist||prev.waist||78});saveState();qs('#weight-input').value='';qs('#waist-input').value='';renderProgress();renderHome();showToast('身体数据已保存')}
function phaseForWeek(week){return PHASES.find(p=>week>=p.from&&week<=p.to)||PHASES[1]}
function phaseClass(phase){if(phase.short==='DELOAD')return 'deload';if(phase.short==='STRENGTH PHASE')return 'strength';if(phase.short==='ASSESSMENT')return 'assessment';return 'build'}
function renderActivityCalendar(){const now=new Date(),year=now.getFullYear(),month=now.getMonth(),firstDay=(new Date(year,month,1).getDay()+6)%7,days=new Date(year,month+1,0).getDate();qs('#activity-month-label').textContent=`${year}.${String(month+1).padStart(2,'0')}`;let html=Array.from({length:firstDay},()=>'<div class="month-day empty"></div>').join('');for(let day=1;day<=days;day++){const date=isoDate(new Date(year,month,day)),sessionLog=state.sessions.find(s=>s.date===date),rest=state.restLogs.some(s=>s.date===date),today=date===isoDate();const mark=sessionLog?(WORKOUTS[sessionLog.workout]?.name||WORKOUT_ORDER[0]):rest?'REST':'';html+=`<div class="month-day ${sessionLog?'workout-day':''} ${rest&&!sessionLog?'rest-day':''} ${today?'today':''}"><span class="date-number">${day}</span>${mark?`<span class="day-mark">${mark}</span>`:''}</div>`}qs('#activity-calendar').innerHTML=html}
function renderPlan(){const phase=getPhase();qs('#plan-phase-name').textContent=phase.name;qs('#plan-phase-desc').textContent=phase.desc;qs('#plan-week-big').innerHTML=`${String(state.week).padStart(2,'0')}<span>/26</span>`;qs('#calendar-current-label').textContent=`当前 · W${String(state.week).padStart(2,'0')}`;qs('#phase-calendar').innerHTML=Array.from({length:26},(_,i)=>{const week=i+1,p=phaseForWeek(week),current=week===state.week;const focus=p.short==='DELOAD'?'恢复':p.short==='STRENGTH PHASE'?'强度':p.short==='ASSESSMENT'?'评估':'渐进';return `<div class="week-cell ${phaseClass(p)} ${current?'current':''}" aria-label="第 ${week} 周 · ${p.name}"><span class="week-num">W${String(week).padStart(2,'0')}</span><span class="week-phase">${p.name}</span><span class="week-focus">${focus}</span></div>`}).join('');renderActivityCalendar();qs('#timeline').innerHTML=PHASES.map(p=>`<div class="phase-row ${state.week>=p.from&&state.week<=p.to?'current':''}"><span class="phase-dot"></span><div><div class="phase-name">${p.name}</div><div class="phase-desc">${p.desc}</div></div><span class="phase-weeks">W${p.from}${p.to!==p.from?`–${p.to}`:''}</span></div>`).join('');
  const thisWeek=weekWorkoutIds(state.week),nextWeek=weekWorkoutIds(Math.min(26,state.week+1));qs('#routine-week-label').textContent=String(state.week).padStart(2,'0');
  qs('#routine-table').innerHTML=`<div class="routine-row head"><span></span><span>本周 · W${String(state.week).padStart(2,'0')}</span><span>下周 · W${String(Math.min(26,state.week+1)).padStart(2,'0')}</span></div>`+DAY_ORDER.map((label,i)=>{const a=thisWeek[i],b=nextWeek[i];const cell=id=>id==='rest'?'<span class="routine-rest">休息</span>':`<span class="routine-tag routine-${id}">${WORKOUTS[id].name}</span>`;return `<div class="routine-row"><span>${label}</span>${cell(a)}${cell(b)}</div>`}).join('');
  qs('#habit-row').querySelectorAll('button').forEach(btn=>{const checked=state.habits[btn.dataset.habit];btn.classList.toggle('checked',!!checked);btn.textContent=`${checked?'●':'○'} ${btn.textContent.slice(2)}`})}
function bindNavigation(){document.querySelectorAll('[data-nav]').forEach(btn=>btn.addEventListener('click',()=>switchView(btn.dataset.nav)));qs('#finish-workout').addEventListener('click',finishWorkout);qs('#save-body-log').addEventListener('click',saveBodyLog);qs('#add-time').addEventListener('click',()=>{const el=qs('#timer-display');const [m,s]=el.textContent.split(':').map(Number);startRest(m*60+s+30)});qs('#skip-time').addEventListener('click',()=>{clearInterval(timerInterval);qs('#rest-timer').hidden=true});document.querySelectorAll('.metric-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.metric-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderChart(btn.dataset.metric)}));qs('#habit-row').addEventListener('click',e=>{const btn=e.target.closest('button');if(!btn)return;state.habits[btn.dataset.habit]=!state.habits[btn.dataset.habit];saveState();renderPlan()});}
function switchView(view){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.dataset.view===view));document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.nav===view));if(view==='workout'){renderWorkout();bindWorkoutEvents()}if(view==='progress')renderProgress();if(view==='plan')renderPlan();if(view==='home')renderHome();window.scrollTo({top:0,behavior:'smooth'})}
function bindModal(){const back=qs('#modal-backdrop');qs('#rir-help').addEventListener('click',()=>back.hidden=false);qs('#modal-close').addEventListener('click',()=>back.hidden=true);back.addEventListener('click',e=>{if(e.target===back)back.hidden=true});const resetBack=qs('#reset-backdrop');qs('#reset-plan').addEventListener('click',()=>resetBack.hidden=false);qs('#reset-close').addEventListener('click',()=>resetBack.hidden=true);qs('#reset-cancel').addEventListener('click',()=>resetBack.hidden=true);resetBack.addEventListener('click',e=>{if(e.target===resetBack)resetBack.hidden=true});qs('#reset-confirm').addEventListener('click',()=>resetTrainingPlan(resetBack))}
function resetTrainingPlan(backdrop){state.week=1;state.weekSessionCount=0;state.nextWorkoutIndex=0;state.nextWorkoutId=null;state.sessions=[];state.workoutLogs=[];state.restLogs=[];state.completedWorkouts=[];currentWorkoutId=WORKOUT_ORDER[0];session=null;saveState();backdrop.hidden=true;renderHome();renderProgress();renderPlan();showToast('训练计划已重置 · 从 Week 1 · Push 开始');switchView('plan')}
let toastTimeout;function showToast(message){const t=qs('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>t.classList.remove('show'),2400)}
init();
