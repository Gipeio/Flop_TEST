const fetchModules = () => {
    $.ajax({
        type: "GET",
        dataType: "text",
        url: url_all_modules_with_desc,
        async: true,
        contentType: 'application/json',
        success: response => {
            let modules = JSON.parse(response).map(o => o);
            ModulesApp.init(modules);
        },
        error: e => {
            console.error(e);
        }
    })
};

class ModulesApp {

    static init(modules) {
        let container = document.getElementById("modules-container");
        let search = document.getElementById("modules-search");
        let filters = document.getElementById("filters");
        let app = new ModulesApp(modules, container, search, filters);
    }

    constructor(modules, container, search, filters) {
        this.modules = modules;
        this.promos = ['ALL'];
        this.filters = filters;
        this.selectedFilter = this.promos[0];
        this.searchResult = modules;
        this.container = container;
        this.search = search;
        this.search.addEventListener('input', e => this.searchModule(e));
        this.modules.forEach(e => !this.promos.includes(e.promo) ? this.promos.push(e.promo) : null);
        this.promos.sort();
        this.render();
    }

    render() {
        this.promos.forEach(p => this.buildFilter(p));
        this.searchResult.forEach(r => {
            this.buildModules(r);
        });
        for (let elem of this.filters.children) {
            elem.addEventListener('click', e => this.filterModule(e));
        }
    }


    buildModules(mod) {
        let card = document.createElement('div');
        card.setAttribute("class", "module__card");
        let tmp_innerHTML = `
            <div id="modal${mod.abbrev}" class="module__modal">
                  <div class="module__modal__background"></div>
                  <div class="module__modal__content">
                        <h1>Decription du module</h1>
                      <p>
                      ${mod.description !== "" ? mod.description : "Aucune description n'a été renseignée."}
                      </p>
                      <span><strong>Responsable du module :</strong> ${mod.resp_last_name} ${mod.resp_first_name}</span>
         `;
        if (is_tutor) {
            tmp_innerHTML += `
                     <a href="${url_modules_desc}/${mod.abbrev}">Modifier la description</a>
            `;
        }
        tmp_innerHTML += `
                  </div>
              <button class="module__modal__close" aria-label="close"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" class="svg-inline--fa fa-times fa-w-11" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg></button>
            </div>
            <div class="left_vertical" style="background: ${mod.color_bg}; color: ${mod.color_txt}">
                <h3 class="module__abbrev">${mod.abbrev}</h3>
            </div>
            <div class="right">
                <span class="module__name">${mod.name}</span>
                <span class="module__resp">${mod.resp}</span>
            </div>
        `;
        card.innerHTML = tmp_innerHTML ;
        card.addEventListener('click', e => {
            document.getElementById(`modal${mod.abbrev}`).classList.toggle('is-open');
        });
        this.container.append(card);
    }

    buildFilter(promo) {
        let filter = document.createElement('button');
        filter.setAttribute("class", this.selectedFilter === promo ? "filter__btn filter__active" : "filter__btn");
        filter.setAttribute("id", promo);
        filter.innerText = `${promo}`;
        this.filters.append(filter);
    }

    filterModule(e) {
        e.preventDefault();
        let selected = e.target;
        let promo = selected.getAttribute('id');
        $(`#${promo}`).siblings().removeClass('filter__active');
        selected.classList.add('filter__active');
        this.searchResult = promo === 'ALL' ? this.modules : this.modules.filter(mod => mod.promo === promo);
        this.selectedFilter = promo;
        this.clearModules();
        this.render();

    }

    searchModule(e) {
        let searchQuery = e.target.value;
        this.selectedFilter = 'ALL';
        this.searchResult = this.modules.filter(mod => mod.abbrev.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
            mod.name.toLowerCase().startsWith(searchQuery.toLowerCase()));
        this.clearModules();
        this.render();
    }

    clearModules() {
        let child = this.container.lastElementChild;
        while (child) {
            this.container.removeChild(child);
            child = this.container.lastElementChild;
        }
        child = this.filters.lastElementChild;
        while (child) {
            this.filters.removeChild(child);
            child = this.filters.lastElementChild;
        }
    }
}

fetchModules();



