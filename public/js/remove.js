var el = document.querySelectorAll('.checkip');

var i=0;
for(;i<el.length;i++)
{
     el[i].addEventListener('click',(event)=>{
     event.path[1].remove();
  });
}
