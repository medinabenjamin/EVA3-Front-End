$(document).ready(function () {
  // ---------------------------
  // 1. Cargar datos dinámicos desde la API
  // ---------------------------
  $('#cargarDatos').on('click', function () {
    const tipo = $('#selector').val();
    cargarDatosDesdeAPI(tipo);
  });

  function cargarDatosDesdeAPI(tipo) {
    const url = `https://jsonplaceholder.typicode.com/${tipo}`;

    $.getJSON(url, function (datos) {
      if ($.fn.DataTable.isDataTable('#tablaDatos')) {
        $('#tablaDatos').DataTable().destroy();
      }

      $('#tablaDatos thead').empty();
      $('#tablaDatos tbody').empty();

      if (datos.length === 0) {
        $('#tablaDatos thead').append('<tr><th>No hay datos</th></tr>');
        return;
      }

      const columnas = Object.keys(datos[0]);

      // Encabezado traducido
      const encabezado = columnas.map(col => `<th>${traducirCampo(col)}</th>`).join('');
      $('#tablaDatos thead').append(`<tr>${encabezado}</tr>`);

      // Filas con datos formateados
      datos.forEach(item => {
        const fila = columnas.map(col => `<td>${formatearDato(item[col], col)}</td>`).join('');
        $('#tablaDatos tbody').append(`<tr>${fila}</tr>`);
      });

      $('#tablaDatos').DataTable();
    }).fail(function () {
      alert('Error al cargar los datos. Revisa tu conexión o intenta de nuevo.');
    });
  }

  // ---------------------------
  // 2. Formatear datos complejos
  // ---------------------------
  function formatearDato(dato, columna) {
    if (columna === 'address' && typeof dato === 'object') {
      return `${dato.street}, ${dato.suite}, ${dato.city}`;
    }

    if (columna === 'company' && typeof dato === 'object') {
      return dato.name;
    }

    if (typeof dato === 'object' && dato !== null) {
      return JSON.stringify(dato);
    }

    return dato;
  }

  // ---------------------------
  // 3. Traducir nombre de campos al español
  // ---------------------------
  function traducirCampo(campo) {
    const traducciones = {
      id: 'ID',
      name: 'Nombre',
      username: 'Usuario',
      email: 'Correo',
      address: 'Dirección',
      phone: 'Teléfono',
      website: 'Sitio Web',
      company: 'Compañía',
      title: 'Título',
      body: 'Contenido',
      userId: 'ID Usuario',
      postId: 'ID Publicación',
      completed: 'Completado'
    };
    return traducciones[campo] || campo;
  }

  // ---------------------------
  // 4. Validación formulario usuarios
  // ---------------------------
  if ($('#formUsuario').length) {
    $('#fechaIngreso').datepicker({
      dateFormat: 'dd/mm/yy'
    });

    $('#btnCancelar').on('click', function () {
      $('#formUsuario')[0].reset();
      $('.error').text('');
      $('input, select').removeClass('input-error');
    });

    $('#formUsuario').on('submit', function (e) {
      e.preventDefault();
      let valido = true;

      $('.error').text('');
      $('input, select').removeClass('input-error');

      const nombre = $('#nombre').val().trim();
      if (nombre === '') {
        $('#errorNombre').text('El nombre es obligatorio');
        $('#nombre').addClass('input-error');
        valido = false;
      }

      const usuario = $('#usuario').val().trim();
      if (usuario === '') {
        $('#errorUsuario').text('El usuario es obligatorio');
        $('#usuario').addClass('input-error');
        valido = false;
      }

      const fecha = $('#fechaIngreso').val().trim();
      const regexFecha = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      if (!regexFecha.test(fecha)) {
        $('#errorFecha').text('Formato de fecha inválido (dd/mm/aaaa)');
        $('#fechaIngreso').addClass('input-error');
        valido = false;
      }

      const email = $('#email').val().trim();
      const regexEmail = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
      if (!regexEmail.test(email)) {
        $('#errorEmail').text('Correo inválido');
        $('#email').addClass('input-error');
        valido = false;
      }

      if (valido) {
        alert('Usuario creado correctamente (envío simulado).');
        $('#formUsuario')[0].reset();
      }
    });
  }

  // ---------------------------
  // 5. Validación formulario objeto (post)
  // ---------------------------
  if ($('#formPost').length) {
    $('#btnCancelarPost').on('click', function () {
      $('#formPost')[0].reset();
      $('.error').text('');
      $('input, textarea').removeClass('input-error');
    });

    $('#formPost').on('submit', function (e) {
      e.preventDefault();

      let valido = true;
      $('.error').text('');
      $('input, textarea').removeClass('input-error');

      const userId = $('#userId').val().trim();
      if (userId === '' || isNaN(userId) || parseInt(userId) <= 0) {
        $('#errorUserId').text('Debe ingresar un ID de usuario válido (número positivo).');
        $('#userId').addClass('input-error');
        valido = false;
      }

      const title = $('#title').val().trim();
      if (title === '') {
        $('#errorTitle').text('El título es obligatorio.');
        $('#title').addClass('input-error');
        valido = false;
      }

      const body = $('#body').val().trim();
      if (body === '') {
        $('#errorBody').text('El contenido es obligatorio.');
        $('#body').addClass('input-error');
        valido = false;
      }

      if (valido) {
        alert('Publicación creada correctamente (envío simulado).');
        $('#formPost')[0].reset();
      }
    });
  }
});
