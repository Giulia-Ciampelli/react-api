// importazioni
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

// modulo stile
import style from '../components/Main.module.css';

// array post iniziali
const initialPostsData = {
    title: '',
    slug: '',
    content: '',
    image: '',
    tags: [],
    public: false
};

export default function Main() {
    const [postsData, setPostsData] = useState(initialPostsData); // variabile per aggiungere post
    const [postList, setPostList] = useState([]); // variabile fetch

    // funzione fetch
    function fetchData(url = 'http://localhost:3000/posts') {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                console.log(data);

                setPostList(data.data);
            })
    }

    // stateEffect per usare fetchData al caricamento della pagina
    useEffect(fetchData, []);

    // funzione per aggiungere un post nuovo
    function addPost(e) {
        e.preventDefault();
        console.log('form sent', postsData);

        // generazione automatica di slug
        let newSlug = postsData.slug;

        // .toLowerCase(), .replace()
        if (!newSlug) {
            newSlug = postsData.title.toLowerCase().replace(/\s+/g, '-');
        }

        // e se uso due titoli uguali?
        // opzioni: creazione di stringa random, o aggiunta allo slug

        // clonazione oggetto
        const newPost = {
            title: postsData.title,
            slug: newSlug || postsData.slug,
            content: postsData.content,
            image: postsData.image,
            tags: postsData.tags,
            public: postsData.public
        };

        // richiesta POST al backend
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        })
            .then(res => res.json())
            .then(data => {
                console.log('Post added', data);

                setPostList([
                    ...postList,
                    data.data
                ]);

                setPostsData(initialPostsData);
            })
            .catch(err => {
                console.error('Error adding post', err);
            })
    }

    // funzione onChange
    function handleFormField(e) {
        const { name, type, checked, value } = e.target;

        // funzione per checkbox public
        const handleCheckboxChange = (name, checkedValue) => {
            if (name === "public") {
                return { public: checkedValue };
            }

            // funzione per altre checkbox
            const updatedTags = checkedValue ? [...postsData.tags, value] : postsData.tags.filter(tag => tag !== value);
            return { tags: updatedTags };
        };

        // funzione per altri input
        const handleInputChange = (name, fieldValue) => {
            return { [name]: fieldValue };
        };

        // determina lo stato a seconda del tipo di input
        let updatedState = {};

        if (type === 'checkbox') {
            updatedState = handleCheckboxChange(name, checked);
        }
        else {
            updatedState = handleInputChange(name, value);
        }

        setPostsData({
            ...postsData,
            ...updatedState
        });
    }


    // funzione per cancellare post
    function handleTrashPost(slug) {

        // test per capire se trova lo slug o meno (errore DELETE null)
        console.log('Post to delete:', slug);

        if (!slug) {
            console.error('No slug found!');
            return;
        }

        // richiesta DELETE al backend
        fetch(`http://localhost:3000/posts/${slug}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                console.log('Post deleted', data);

                // aggiornamento UI con filtro dentro
                setPostList(postList.filter(post => post.slug !== slug));
            })
            .catch(err => {
                console.error('Error deleting post', err);
            })
    }

    return (
        <main>
            <div className={style.container}>
                <div className={style.row}>
                    <form onSubmit={addPost}>

                        {/* #region input */}
                        <div className={style.addPost}>

                            {/* input nome */}
                            <input type="text"
                                id="textInput"
                                name="title"
                                placeholder="Titolo nuovo post"
                                value={postsData.name}
                                onChange={handleFormField}
                                required />

                            {/* input immagine */}
                            <input type="text"
                                id="textImageInput"
                                name="image"
                                placeholder="URL immagine"
                                value={postsData.image}
                                onChange={handleFormField}
                                required />

                            {/* input contenuto */}
                            <textarea
                                id="descInput"
                                name="content"
                                placeholder="Contenuto post..."
                                value={postsData.content}
                                onChange={handleFormField}
                                required>
                            </textarea>

                            {/* input select categoria */}
                            <select
                                id="selectInput"
                                name="category"
                                placeholder="Seleziona categoria post"
                                value={postsData.category}
                                onChange={handleFormField}>
                                <option value="1">
                                    cat1
                                </option>
                                <option value="2">
                                    cat2
                                </option>
                                <option value="3">
                                    cat3
                                </option>
                                <option value="4">
                                    cat4
                                </option>
                                <option value="5">
                                    cat5
                                </option>
                            </select>

                            {/* input checkbox tags */}
                            <h3>
                                Scegli il tag:
                            </h3>
                            <div className={style.tagsContainer}>
                                <label>
                                    <input type="checkbox"
                                        id="checkInput1"
                                        name="tag1"
                                        value="Dolci"
                                        checked={postsData.tags.includes("Dolci")}
                                        onChange={handleFormField} />
                                    Dolci
                                </label>
                                <label>
                                    <input type="checkbox"
                                        id="checkInput2"
                                        name="tag2"
                                        value="Torte"
                                        checked={postsData.tags.includes("Torte")}
                                        onChange={handleFormField} />
                                    Torte
                                </label>
                                <label>
                                    <input type="checkbox"
                                        id="checkInput3"
                                        name="tag3"
                                        value="Ricette vegetariane"
                                        checked={postsData.tags.includes("Ricette vegetariane")}
                                        onChange={handleFormField} />
                                    Ricette vegetariane
                                </label>
                                <label>
                                    <input type="checkbox"
                                        id="checkInput4"
                                        name="tag4"
                                        value="Ricette al forno"
                                        checked={postsData.tags.includes("Ricette al forno")}
                                        onChange={handleFormField} />
                                    Ricette al forno
                                </label>
                                <label>
                                    <input type="checkbox"
                                        id="checkInput5"
                                        name="tag5"
                                        value="Antipasti"
                                        checked={postsData.tags.includes("Antipasti")}
                                        onChange={handleFormField} />
                                    Antipasti
                                </label>
                                <label>
                                    <input type="checkbox"
                                        id="checkInput6"
                                        name="tag6"
                                        value="Primi piatti"
                                        checked={postsData.tags.includes("Primi piatti")}
                                        onChange={handleFormField} />
                                    Primi piatti
                                </label>
                                <label>
                                    <input type="checkbox"
                                        id="checkInput7"
                                        name="tag7"
                                        value="Dolci veloci"
                                        checked={postsData.tags.includes("Dolci veloci")}
                                        onChange={handleFormField} />
                                    Dolci veloci
                                </label>
                                <label>
                                    <input type="checkbox"
                                        id="checkInput8"
                                        name="tag8"
                                        value="Ricette veloci"
                                        checked={postsData.tags.includes("Ricette veloci")}
                                        onChange={handleFormField} />
                                    Ricette veloci
                                </label>
                                <label>
                                    <input type="checkbox"
                                        id="checkInput9"
                                        name="tag9"
                                        value="Dolci al cioccolato"
                                        checked={postsData.tags.includes("Dolci al cioccolato")}
                                        onChange={handleFormField} />
                                    Dolci al cioccolato
                                </label>
                            </div>

                            {/* input pubblica o meno */}
                            <label className={style.publicCheck}>
                                <input type="checkbox"
                                    id="checkInputPublic"
                                    name="public"
                                    checked={postsData.public}
                                    onChange={handleFormField} />
                                Post pubblico
                            </label>

                            {/* bottone submit */}
                            <button type="submit">
                                Aggiungi post
                            </button>
                        </div>
                        {/* #endregion input */}

                        {/* #region output */}
                        <ul>
                            {postList.length ? postList.map((post, index) => <li key={index}>
                                <div className={style.card}>
                                    <h2>

                                        {/* prova: aggiungi un modo per accedere allo slug giusto */}
                                        <a href={`http://localhost:3000/posts/${post.slug}`}>
                                            {post.title}
                                        </a>
                                    </h2>
                                    <img src={`http://localhost:3000/${post.image}`} alt={post.title} />
                                    <p>
                                        {post.content}
                                    </p>
                                    <p>
                                        {post.category}
                                    </p>
                                    <div className={style.tags}>
                                        <h2>
                                            Tags:
                                        </h2>
                                        <p>
                                            {Array.isArray(post.tags) && post.tags.length > 0 ? post.tags.join(', ') : 'No tags available'}
                                        </p>
                                    </div>
                                    <p>
                                        {post.public ? 'Post pubblico' : 'Post privato'}
                                    </p>
                                </div>

                                {/* RICORDA: inserire sempre type=button per bottoni non per POST, o va in submit per default */}
                                <button type="button" data-slug={post.slug} onClick={() => handleTrashPost(post.slug)}>
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                            </li>) : <p>No posts yet</p>}
                        </ul>
                        {/* #endregion output */}
                    </form>
                </div>
            </div>
        </main>
    )
}