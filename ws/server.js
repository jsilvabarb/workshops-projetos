
const express = require("express") 
const server = express()

const db = require("./db")

// const ideas = [
//     {
//         img: "https://image.flaticon.com/icons/svg/1688/1688400.svg",
//         title:"Cursos de Programação",
//         category:"Estudo",
//         description:" Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
//         url:"https://rocketseat.com.br/"
//     },

//     {
//         img: "https://image.flaticon.com/icons/svg/1468/1468372.svg",
//         title:"Exercícios",
//         category:"Saúde",
//         description:" Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
//         url:"https://rocketseat.com.br/"
//     },

//     {
//         img: "https://image.flaticon.com/icons/svg/1830/1830796.svg",
//         title:"Meditação",
//         category:"Mentalidade",
//         description:" Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
//         url:"https://rocketseat.com.br/"
//     },

//     {
//         img: "https://image.flaticon.com/icons/svg/1830/1830796.svg",
//         title:"Karaokê",
//         category:"Diversão",
//         description:" Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
//         url:"https://rocketseat.com.br/"
//     },
// ]

//configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

//habilitar uso do req body
server.use(express.urlencoded({ extended: true }))

//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
}) 


server.get("/", function (req, res) {

    db.all(`SELECT * FROM ideas `, function(err, rows) {
        if(err) return console.log(err)

        const reversedIdeas = [...rows].reverse()

        let lastIdeas = []
        for( idea of reversedIdeas) {
            if(lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }

        return res.render("index.html", { ideas: lastIdeas })
        })

        
        
    
})

server.get("/ideias", function (req, res) {

    db.all(`SELECT * FROM ideas `, function(err, rows) {

        if(err) return console.log(err)

        const reversedIdeas = [...rows].reverse()
        return res.render("ideias.html", { ideas: reversedIdeas})
    })
   
})

server.post("/", function(req, res) {

     //inserir dado na tabela 

const query = `
            INSERT INTO ideas (
                image,
                title,
                category,
                description,
                link
        ) VALUES (?, ?, ?, ?, ?);
    `
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
    ]
    db.run(query, values, function(err) {
        if(err) {
            console.log(err)
            return res.send("Erro no Banco de Dados")
        }

        return res.redirect("/ideias")
       
    })
    
})

server.listen(3000)