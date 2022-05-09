export function renderCat (){
    let cat = document.querySelector('.category')
    let catName = ["一般", "上班","科技","愛情","音樂","政治"]
    let catColor = ["#6DD5FA","#f64f59","#a8ff78","#f5af19","#c471ed","#86a8e7"]

    for (let i = 0;i<6;i++){
       
   
        let label = document.createElement('label')
        label.style.display="flex"
        label.className="cat_label"
     
        let spancircle = document.createElement('span')
        spancircle.className="cat__circle"
        let spantxt = document.createElement('span')
        spantxt.className="cat_name"

      
        spancircle.style.backgroundColor=catColor[i]
        spancircle.style.display="inline-block"
        spancircle.style.borderRadius="50%"
        spantxt.textContent=catName[i]
        

    

        let input = document.createElement('input')
        input.name="cat_radio-group"
        input.type="radio"
        input.id = `radio${i}`
        input.style.display="None"
        input.className="cat_radio"
        label.append(input,spancircle,spantxt)
        cat.append(label)


    }




}