@extends('layouts.main')

@section('content')

    <div class="upload">
        <div class="photo-menu">
            <div class="desktop-menu">
                <div class="left-side-menu">
                    <div class="menu" id="camera">
                        <img src="images/camera.png">
                        <span>Cámara</span>
                    </div>

                    <div class="menu" id="load">
                        <img src="images/load.png">
                        <span>Cargar</span>
                    </div>

                    <div class="menu" id="save">
                        <a class="download" download="download.png"><img src="images/save.png">
                        <span>Guardar</span></a>
                    </div>

                    <div class="menu" id="share">
                        <img src="images/share.png">
                        <span>Compartir</span>
                    </div>

                    <div class="submenu">
                        <!-- <img src="images/instagram.png" id="instagram"> -->
                        <img src="images/facebook.png" id="facebook">
                        <img src="images/twitter.png" id="twitter">
                    </div>
                </div>

                <div class="right-side-menu">
                    <div class="menu" id="delete">
                        <span>Eliminar</span>
                        <img src="images/delete.png">
                    </div>
                </div>
            </div>

            <div class="mobile-menu">
                <div align="right">
                    <img src="images/menu.png" id="dropdown_menu">
                </div>

                <ul class="dropdown-menu">
                    <li id="dropdown_camera">
                        <img src="images/camera.png">
                        <span>Cámara</span>
                    </li>

                    <li id="dropdown_load">
                        <img src="images/load.png">
                        <span>Cargar</span>
                    </li>

                    <li id="dropdown_save">
                        <img src="images/save.png">
                        <span>Guardar</span>
                    </li>

                    <li id="dropdown_share">
                        <img src="images/share.png">
                        <span>Compartir</span>
                    </li>

                    <ul class="dropdown-submenu">
                        <!-- <li id="dropdown_instagram"><img src="images/instagram.png"></li> -->
                        <li id="dropdown_facebook"><img src="images/facebook.png"></li>
                        <li id="dropdown_twitter"><img src="images/twitter.png"></li>
                    </ul>

                    <li id="dropdown_delete">
                        <img src="images/delete.png">
                        <span>Eliminar</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="picture-area" id="photo_module">
            <div class="image-section">
                <div class="image-preview" id="image_preview">
                    <input type="file" name="image" class="image-upload" id="image_upload" accept="image/*" />
                </div>

                <div class="camera-view" id="camera_view"></div>
            </div>
    
            <div class="full-section">
                <img src="images/add.png">
            </div>

            <div class="full-section">
                <div class="picture-area-text">
                    <span>Arrastra o haz clic para subir tu imagen.<br />Recuerda que también puedes hacer una foto con tu cámara.<br/>Archivos JPG y PNG de menos de 2 MB.</span>
                </div>
            </div>

            <canvas id="canvas">
        </div>

        <div class="filter">
            <img src="images/filter.png">
        </div>
    </div>

    <div class="thumbs">
        <div class="grid"></div>
    </div>

    <div class="overlay" id="upload_overlay">
        <div class="progress">
            <div class="bar"></div>
            <div class="percent">0%</div>
        </div>
    </div>

    <div class="overlay" id="remove_overlay">
        <div class="remove">
            <img src="images/loading.png" class="rotate-image">
            <span>&nbsp;Removing...</span>
        </div>
    </div>

    <div class="overlay" id="alert_overlay">
        <div class="alert-box">
            <div class="alert-close">
                <img src="images/close_white.png">
            </div>
            <div>
                <h4 class="alert-title">¡UPS! Tu foto no ha podido cargarse</h4>
                <div class="alert-line"></div>
                <h5>Parece que ha ocurrido algo extraño...</h5>
                <h4 class="alert-link">POR FAVOR, INTÉNTALO DE NUEVO</h4>
            </div>
        </div>
    </div>

    <div class="overlay" id="invalid_overlay">
        <div class="alert-box">
            <div class="alert-close">
                <img src="images/close_white.png">
            </div>
            <div>
                <h4 class="alert-title">¡UPS! Tu foto no ha podido cargarse</h4>
                <div class="alert-line"></div>
                <h5>Recuerda que la imagen debe pesar menos<br/>de 2MB y estar en .jpg o .png</h5>
                <h4 class="alert-link">POR FAVOR, REVISA TU IMAGEN E INTÉNTALO DE NUEVO</h4>
            </div>
        </div>
    </div>

    <div class="overlay" id="share_overlay">
        <div class="alert-box">
            <div class="alert-close">
                <img src="images/close_white.png">
            </div>
            <div>
                <h5 class="alert-title">¿Estás seguro de que te gusta esta foto? ¿Vas bien de moreno? ¿Necesitas un poco más de enfoque? Recuerda que se añadirá a la galería.</h5>
                <div class="alert-line"></div>
                <div class="alert-left">
                    <h5>Si salgo más guapo, rompo el objetivo.</h5>
                    <h4 class="alert-link" id="alert_share">¡ADELANTE!</h4>
                </div>
                <div class="alert-right">
                    <h5 class="alert-link" id="reload_link">Voy a probar otra vez</h5>
                    <h5>&nbsp;con la cara lavada, el ventilador encendido y la melena al viento</h5>
                </div>
            </div>
        </div>
    </div>

    <div class="overlay" id="cookie_overlay">
        <div class="alert-box">
            <div class="alert-close">
                <img src="images/close_white.png">
            </div>
            <div>
                <h5 class="alert-title">Política de Cookies</h5>
                <div class="alert-line"></div>
                <div class="cookie-content">
                    <h5>Una cookie es un pequeño fichero de texto que se almacena en su navegador cuando visita casi cualquier página web. Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página. Las cookies suelen almacenar información de carácter técnico, preferencias personales, personalizacion de contenidos, estaddisticas de uso, enlaces a redes sociales, acceso a cuentas de usuario, etc. El objetivo de las cookies es adaptar el contenido de la web a superfil y necesidades, sin cookies los servicios ofrecidos por cualquier página se verian mermados notablemente.<br/><br/>Cookies utilizadas en este sitio web<br/><br/>Siguiendo las directrices de la Agencia Española de Proteccioin de Datos, procedemos a detalar el uso de cookies que hace esta web con el fin de informarle ocn la máxima exactitud posible.<br/><br/>Este sitio web utiliza las siguientes cookies de terceros:<br/><br/>Google Analytics: Almacena cookies para poder elaborar estadísticas sobre el tráfico y volumen de visitas de esta web. Al utilizar este sitio web está consintiendo el tratamiento de información acerca de usted por Google. Por tanto, el ejercicio de cualquier derecho en este sentido deberá hacerlo comunicando directamente con Google.<br/><br/>Redes sociales: Cada red social utiliza sus propias cookies para que usted pueda pinchar en botones del tipo Me gusta o Compartir.<br/><br/>Desactivación o eliminacicón de cookies<br/><br/>EN cualquier moento podrá ejercer su derecho de desactivación o eliminacioin de cookies de este sitio web. Estas acciones se realizan de forma diferente en función del navegador que sté usando.<br/><br/>Notas adicionales<br/><br/>Ni esta web ni sus representantes legales se hacen responsables ni del contenido ni de la veracidad de las políticas de privacidad que puedan tener los terceros mencionados en esta política de cookies.<br/>Los navegadores web son las herramientas encargadas de almacenar las cokies y desde este lugar debe efectuar su derecho a eliminacicón o desactivacióin de las mismas. Ni esta web ni sus representantes legales pueden garantizar la correcta o incorrecta manipulacicon de las cookies por parte de los mencionados navegadores.<br/>En algunos casos es necesario instalar cookies para que el navegador no olvide su decisión de no aceptación de las mismas.<br/>En el caso de las cookies de Google Analytics, esta empresa almacena las cokies en servidores ubicados en EStados Unidosy se compromete a no compartirla con terceros, excepto en los casos en los que sea necesario para el funcionamiento del sistema o cuando la ley obligue a tal efecto. Según Google no guarda su direccion IP. Google Inc. es una compañía adherida al Acuerdo de Puerto Seguro que garantiza que todos los datos transferidos serán tratados con un nivel e proteccioin acocrde a la normativa europea. Para cualquier duda o consulta acerca de esta política de cookies no dude en comunicarse con nosotros.</h5>
                </div>
                <h4><span class="alert-link">ENTENDIDO</span></h4>
            </div>
        </div>
    </div>

    <div class="overlay" id="preloading_overlay">
        <img src="images/loader_white.gif" alt="Loading...">
    </div>

    <div class="cookies">
        <div class="cookies-section">
            <div class="cookie-close">
                <img src="images/close_white.png">
            </div>
            <div>
                <h4>Gipsy cookies</h4>
                <h5>La Ley 34/2002 dice que tenemos que hablar. Usamos cookies propias y de terceros (no hay terceras partes implicadas) con objetivos estadísticos. Tenemos una política de cookies morena y salerosa que puedes consultar <span class="cookie-link cookie-show">aquí</span>. Si continúas navegando, entendemos que la aceptas. Si no te parece bien, tendrás que lucir moreno mediante el método tradicional (exposición solar o enfado de gran nivel). Recuerda, puedes pinchar <span class="cookie-link cookie-show">en este enlace</span> para conocer los detalles. Este mensaje no debería volver a aparecer (aunque, en ocasiones, se broncea demasiado y se viene arriba).</h5>
                <h4 class="cookie-link">Te digo sí, te digo vale, te digo todo entendido</h4>
            </div>
        </div>
    </div>

    <script src="js/main.js"></script>
    
@endsection