const key="todo_notes_animated2";
let list=JSON.parse(localStorage.getItem(key)||"[]");
let filter="all";

const listEl=document.getElementById("list");
const input=document.getElementById("taskInput");
const due=document.getElementById("dueInput");
const count=document.getElementById("count");

function save(){localStorage.setItem(key,JSON.stringify(list))}

function render(){
  listEl.innerHTML="";

  const items=list.filter(i =>
    filter==="active" ? !i.done :
    filter==="completed" ? i.done : true
  );

  items.forEach(i=>{
    const li=document.createElement("li");
    li.className="item"+(i.done?" completed":"");

    const check=document.createElement("button");
    check.className="check";
    check.textContent=i.done?"✓":"";
    check.onclick=()=>{i.done=!i.done;save();render()};

    const title=document.createElement("div");
    title.className="title";
    title.textContent=i.text;
    title.ondblclick=()=>edit(title,i);

    const meta=document.createElement("div");
    meta.className="meta";
    meta.textContent=i.due?new Date(i.due).toLocaleDateString():"";

    const del=document.createElement("button");
    del.className="icon-btn";
    del.textContent="🗑";
    del.onclick=()=>{list=list.filter(t=>t.id!==i.id);save();render()};

    meta.append(del);
    li.append(check,title,meta);
    listEl.append(li);
  });

  count.textContent=list.filter(i=>!i.done).length + " left";
}

function add(){
  if(!input.value.trim()) return;
  list.unshift({
    id:Date.now(),
    text:input.value,
    due:due.value||null,
    done:false
  });
  input.value=""; due.value="";
  save(); render();
}

function edit(el,item){
  el.contentEditable=true;
  el.focus();
  el.onblur=()=>{
    item.text=el.textContent.trim()||item.text;
    el.contentEditable=false;
    save();render();
  }
}

document.getElementById("addBtn").onclick=add;
input.onkeydown=(e)=>{if(e.key==="Enter") add()};
document.getElementById("clearCompleted").onclick=()=>{
  list=list.filter(i=>!i.done);
  save();render();
};

document.querySelectorAll(".filters button").forEach(b=>{
  b.onclick=()=>{
    document.querySelector(".filters .active").classList.remove("active");
    b.classList.add("active");
    filter=b.dataset.filter;
    render();
  }
});

render();
