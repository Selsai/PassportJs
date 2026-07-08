import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWandMagicSparkles,
  faImage,
  faLocationDot,
  faClock,
  faStar,
  faTag,
  faPenNib,
  faCircleCheck,
  faUpload,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import Card from "../components/Card";
import { useData } from "../context/DataContext";

const CATEGORY_PRESETS = [
  "Architecture",
  "Sea",
  "Nature",
  "Food",
  "Beach",
  "Culture"
];

const EMPTY_FORM = {
  title: "",
  category: "Beach",
  customCategory: "",
  location: "",
  readingTime: "3 min",
  rating: "4.8",
  img: "",
  desc: "",
  longDesc: ""
};

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80";

// Taille max acceptée pour l'image importée (2 Mo), pour éviter de saturer le localStorage
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const Create = () => {
  const { addPost } = useData();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [justPublished, setJustPublished] = useState(false);
  const [imageName, setImageName] = useState("");

  const category =
    form.category === "Autre" ? form.customCategory.trim() : form.category;

  const previewPost = useMemo(
    () => ({
      id: "preview",
      title: form.title.trim() || "Le nom de votre destination",
      category: category || "Catégorie",
      location: form.location.trim() || "Quelque part en Tunisie",
      readingTime: form.readingTime.trim() || "3 min",
      rating: form.rating || "4.8",
      img: form.img.trim() || PLACEHOLDER_IMG,
      desc:
        form.desc.trim() ||
        "Un court résumé qui donne envie de cliquer sur \"Discover\"."
    }),
    [form, category]
  );

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((err) => ({ ...err, img: "Le fichier doit être une image." }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((err) => ({
        ...err,
        img: "L'image est trop lourde (2 Mo maximum)."
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, img: reader.result }));
      setImageName(file.name);
      setErrors((err) => ({ ...err, img: undefined }));
    };
    reader.onerror = () => {
      setErrors((err) => ({
        ...err,
        img: "Impossible de lire ce fichier, réessayez."
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((f) => ({ ...f, img: "" }));
    setImageName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateStepOne = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Un titre est requis.";
    if (!category) errs.category = "Choisissez ou précisez une catégorie.";
    if (!form.location.trim()) errs.location = "La localisation est requise.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStepTwo = () => {
    const errs = {};
    if (!form.desc.trim()) errs.desc = "Le résumé court est requis.";
    if (!form.longDesc.trim()) errs.longDesc = "Le texte complet est requis.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Étape 1 : le bouton "Étape suivante" est aussi un bouton submit (même
    // apparence que le bouton final), on gère donc la transition ici plutôt
    // qu'avec un type="button" séparé, qui perdait le style des autres CTA.
    if (step === 1) {
      if (validateStepOne()) setStep(2);
      return;
    }

    if (!validateStepTwo()) return;

    const newPost = addPost({
      title: form.title.trim(),
      category,
      location: form.location.trim(),
      readingTime: form.readingTime.trim() || "3 min",
      rating: parseFloat(form.rating) || 4.8,
      img: form.img.trim() || PLACEHOLDER_IMG,
      desc: form.desc.trim(),
      longDesc: form.longDesc.trim()
    });

    setJustPublished(true);
    setTimeout(() => navigate(`/post/${newPost.id}`), 900);
  };

  return (
    <div className="createPage">
      <div className="createIntro">
        <span className="heroBadge dark">
          <FontAwesomeIcon icon={faWandMagicSparkles} />
          Espace créateur
        </span>
        <h1 className="createTitle">Racontez votre Tunisie</h1>
        <p className="createSubtitle">
          Composez une nouvelle destination et regardez-la prendre vie en
          temps réel dans l'aperçu, exactement comme les autres visiteurs la
          verront.
        </p>
      </div>

      <div className="createLayout">
        <form className="createForm" onSubmit={handleSubmit}>
          <div className="createSteps">
            <div className={`createStep${step === 1 ? " active" : ""}`}>
              <span>1</span> Les infos
            </div>
            <div className="createStepLine" />
            <div className={`createStep${step === 2 ? " active" : ""}`}>
              <span>2</span> Le récit
            </div>
          </div>

          {step === 1 && (
            <div className="createFields">
              <label className="formField">
                <span>
                  <FontAwesomeIcon icon={faPenNib} /> Titre de la destination
                </span>
                <input
                  type="text"
                  placeholder="Ex. Les gorges de Chebika"
                  value={form.title}
                  onChange={update("title")}
                />
                {errors.title && <em className="fieldError">{errors.title}</em>}
              </label>

              <label className="formField">
                <span>
                  <FontAwesomeIcon icon={faTag} /> Catégorie
                </span>
                <select value={form.category} onChange={update("category")}>
                  {CATEGORY_PRESETS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Autre">Autre…</option>
                </select>
                {form.category === "Autre" && (
                  <input
                    type="text"
                    placeholder="Précisez la catégorie"
                    value={form.customCategory}
                    onChange={update("customCategory")}
                    style={{ marginTop: 10 }}
                  />
                )}
                {errors.category && (
                  <em className="fieldError">{errors.category}</em>
                )}
              </label>

              <div className="createFieldsRow">
                <label className="formField">
                  <span>
                    <FontAwesomeIcon icon={faLocationDot} /> Lieu
                  </span>
                  <input
                    type="text"
                    placeholder="Ex. Tozeur"
                    value={form.location}
                    onChange={update("location")}
                  />
                  {errors.location && (
                    <em className="fieldError">{errors.location}</em>
                  )}
                </label>

                <label className="formField">
                  <span>
                    <FontAwesomeIcon icon={faClock} /> Temps de lecture
                  </span>
                  <input
                    type="text"
                    placeholder="Ex. 4 min"
                    value={form.readingTime}
                    onChange={update("readingTime")}
                  />
                </label>
              </div>

              <div className="createFieldsRow">
                <label className="formField">
                  <span>
                    <FontAwesomeIcon icon={faStar} /> Note (/5)
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={update("rating")}
                  />
                </label>

                <label className="formField">
                  <span>
                    <FontAwesomeIcon icon={faImage} /> Image
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    id="createImageInput"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />

                  {!form.img ? (
                    <button
                      type="button"
                      className="oauthBtn secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FontAwesomeIcon icon={faUpload} />
                      Choisir un fichier
                    </button>
                  ) : (
                    <div className="fileChip">
                      <img src={form.img} alt="Aperçu" className="fileChipThumb" />
                      <span className="fileChipName">{imageName || "Image importée"}</span>
                      <button
                        type="button"
                        className="fileChipRemove"
                        onClick={removeImage}
                        aria-label="Retirer l'image"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  )}
                  {errors.img && <em className="fieldError">{errors.img}</em>}
                </label>
              </div>

              <button type="submit" className="submit">
                Étape suivante →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="createFields">
              <label className="formField">
                <span>Résumé court (affiché sur la carte)</span>
                <textarea
                  rows={3}
                  placeholder="Une phrase qui donne envie de cliquer sur Discover…"
                  value={form.desc}
                  onChange={update("desc")}
                />
                {errors.desc && <em className="fieldError">{errors.desc}</em>}
              </label>

              <label className="formField">
                <span>Récit complet (affiché sur la page article)</span>
                <textarea
                  rows={7}
                  placeholder="Racontez l'ambiance, les odeurs, la lumière…"
                  value={form.longDesc}
                  onChange={update("longDesc")}
                />
                {errors.longDesc && (
                  <em className="fieldError">{errors.longDesc}</em>
                )}
              </label>

              <div className="createFieldsRow">
                <button
                  type="button"
                  className="oauthBtn secondary"
                  onClick={() => setStep(1)}
                >
                  ← Précédent
                </button>
                <button type="submit" className="submit">
                  {justPublished ? (
                    <>
                      <FontAwesomeIcon icon={faCircleCheck} />
                      Publié !
                    </>
                  ) : (
                    "Publier la destination"
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="createPreview">
          <div className="previewLabel">
            <span className="pulseDot" />
            Aperçu en direct
          </div>
          <Card post={previewPost} />
        </div>
      </div>
    </div>
  );
};

export default Create;