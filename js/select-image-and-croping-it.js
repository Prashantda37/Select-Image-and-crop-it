/**
 *  This is plugin to use for browse imageSelect Part of image and crop it.
 *  
 *  @package select-image-and-croping-it.js
 *  @auther Prashant Dahiwadkar <prashantda37@gmail.com>
 *
 *  @version 0.0.1
 */
$(function(){
    var imagescrop = function(wrap){
        
        var $container,
            wrap = $(wrap).get(0),
            min_width = 60,
            min_height = 60,
            max_width = 600,
            max_height = 600,
            save_state = {},main_conatainer, canvas;
        
        var init = function(){
            $(wrap).append('<div class="image_container"><canvas id="image_target" width="600" height="500"></canvas></div>');
            //<div class="image_container"><img src="#" id="image_target" /></div>
            $('#image_target').before('<div class="overlay"><div class="inner-overlay"></div></div>');
            $('.overlay').append('<span class="resize-handler resize-nw"></span>')
                         .append('<span class="resize-handler resize-ne"></span>')
                         .append('<span class="resize-handler resize-sw"></span>')
                         .append('<span class="resize-handler resize-se"></span>');
                         
            $('.overlay').after('<button class="btn js-crop">CROP</button>');             
            
            canvas = $('#image_target').get(0);
            
            $container = $('.overlay').get(0);
            main_conatainer = $($container).parent('.image_container');
            
            $(wrap).on('change', '#image', displayImage);
            $(wrap).on('mousedown', '.inner-overlay', moving);
            $(wrap).on('mousedown', '.resize-handler', resizing);
            
            $('.js-crop').on('click', crop);
        };
        var resizing = function(e){
                e.preventDefault();
                saveEventState(e);
                $(document).on('mousemove', startResizing);
                $(document).on('mouseup', endResizing);
            };
            var startResizing = function(e){
                e.preventDefault();
                var mouse = {}, width, height, left, top;
                mouse.x = (e.clientX || e.pageX) + $(window).scrollLeft();
                mouse.y = (e.clientY || e.pageY) + $(window).scrollTop();
                
                if($(save_state.evnt.target).hasClass('resize-ne')){
                    width = mouse.x - save_state.content_left;
                    height = save_state.content_height - (mouse.y - save_state.content_top);
                    left = save_state.content_left;
                    top =  mouse.y;
                   
                }else if($(save_state.evnt.target).hasClass('resize-nw')){
                    width = save_state.content_width - (mouse.x - save_state.content_left);
                    height = save_state.content_height - (mouse.y - save_state.content_top);
                    left = mouse.x; //save_state.content_left;
                    top =  mouse.y;
                }else if($(save_state.evnt.target).hasClass('resize-sw')){
                    width = save_state.content_width - (mouse.x - save_state.content_left);
                    height = mouse.y - save_state.content_top;
                    left = mouse.x;
                    top =  save_state.content_top;
                    
                }else if($(save_state.evnt.target).hasClass('resize-se')){
                    width = mouse.x - save_state.content_left;
                    height = mouse.y - save_state.content_top;
                    left = save_state.content_left;
                    top =  save_state.content_top;
                    
                }
                
                if(min_width < width && min_height < height && max_width > width && max_height > height){
                     if(($(main_conatainer).offset().top + $(main_conatainer).height() <  top + height)){
                         return;
                     }
                     if($(main_conatainer).offset().left >  left){
                         return;
                     }
                     if($(main_conatainer).offset().top > top){
                         return;
                     }
                     if($(main_conatainer).offset().left +  $(main_conatainer).width() < left + width){
                         return;
                     }
                     
                     $($container).width(width).height(height);
                     $($container).offset({
                        'left':left,
                        'top':top
                     });
                     $('.inner-overlay').width(width - 50).height(height - 50);
                     
                }
                //console.log($(save_state.evnt.target).hasClass('resize-ne'));
                
            };
        var endResizing = function(e){
                e.preventDefault();
                $(document).off('mousemove', startResizing);
                $(document).off('mouseup', endResizing);
            }
        // moving start here
        var moving = function(e){
            e.preventDefault();
            saveEventState(e);
            $(document).on('mousemove', startMoving);
            $(document).on('mouseup', endMoveing);
        };
        var startMoving = function(e){
                e.preventDefault();
                //e.stopPropogation();
                var mouse = {};
                mouse.x = (e.clientX || e.pageX) + $(window).scrollLeft();
                mouse.y = (e.clientY || e.pageY) + $(window).scrollTop();
               
                if(main_conatainer.offset().left < mouse.x - (save_state.mouse_x - save_state.content_left) 
                   && main_conatainer.offset().top < mouse.y - (save_state.mouse_y - save_state.content_top)
                   && main_conatainer.offset().top + main_conatainer.height() > mouse.y - (save_state.mouse_y - save_state.content_top) + save_state.content_height &&
                   main_conatainer.offset().left + main_conatainer.width() > mouse.x - (save_state.mouse_x - save_state.content_left) + save_state.content_width
                ){
                    $($container).offset({
                        'left':mouse.x - (save_state.mouse_x - save_state.content_left),
                        'top':mouse.y - (save_state.mouse_y - save_state.content_top)
                    });
                }
                
            };
            var endMoveing = function(e){
                e.preventDefault();
                $(document).off('mousemove', startMoving);
                $(document).off('mouseup', endMoveing);
            };
        var saveEventState = function(e){
            save_state.content_width = $($container).width();
            save_state.content_height = $($container).height();
            save_state.content_left = $($container).offset().left;
            save_state.content_top = $($container).offset().top;
            save_state.mouse_x = (e.clientX || e.pageX) + $(window).scrollLeft();
            save_state.mouse_y = (e.clientY || e.pageY) + $(window).scrollTop();
            save_state.evnt = e;
        };
        var displayImage = function(){
               var img = new Image();
               var ctx = canvas.getContext("2d");
               
                if(this.files && this.files[0]){
                    var reader = new FileReader();
                    $(".image_container").show();
                    reader.onload = function(e){
                        img.src = e.target.result;
                        ctx.drawImage(img, 0, 0, 600, 500);
                        //$("#image_target").attr('src', e.target.result);
                    }
                    reader.readAsDataURL(this.files[0]);
                }
        };
        var crop = function(){
                //console.log($($container).width());
                var crop_canvas, w = $($container).width(),
                    h = $($container).height(),
                    left = $($container).offset().left - main_conatainer.offset().left,
                    top = $($container).offset().top - main_conatainer.offset().top,
                    img = $('#image_target').get(0);
                    
                    
                crop_canvas = document.createElement('canvas');
                crop_canvas.width = w;
                crop_canvas.height = h;
                
                crop_canvas.getContext('2d').drawImage(img, left, top, w, h, 0, 0, w, h);
                window.open(crop_canvas.toDataURL('image/png'));
            }
        init();
    };
    imagescrop('.wrap');
    
});