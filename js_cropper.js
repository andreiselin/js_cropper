var jscropper = {
    
    // call this function to show dialog, all the attributes are required
    show: function(
                 the_img,           // image SRC
                 the_destination,   // object to be pushed with returned cut_coords={cut=true,x=,y=,w=,h=} subobject
                 the_z_index        // dialog z-index
        ){
        // updating arguments
        jscropper.start_coords = {x:0,y:0};         // top left corner default coordinates
        jscropper.end_coords = {x:100,y:100};       // bottom right corner default coordinates
        jscropper.move_target = "none";             // the point we move
        jscropper.point_start_coords = {};          // start moving coordinates of the point we move
        jscropper.mouse_start_coords = {};          // start moving coordinates of the mouse
        jscropper.mouse_current_coords = {};        // in move coordinates of the mouse
        jscropper.destination = the_destination;    // object to append coordinates to

        // generating cropping dialog
        var jscropper_interface = document.createElement('div');
        jscropper_interface.style.cssText = 'position:absolute;width:100%;height:100%;padding:35px;z-index:'+the_z_index+';background:rgba(255,255,255,0.8); overflow:scroll;top: 0px;left: 0px;';
        jscropper_interface.id = 'jscropper_interface';
        document.body.appendChild(jscropper_interface);
        var the_html = "";
        the_html += "<div style='margin-bottom:20px; font-size:18px;'>Set top-left and bottom-right points of image to crop:</div>";
        the_html += "<div style='margin-top:20px; font-size:18px;'><a onclick='jscropper.ok()'>fit_end</a></div>";
        the_html += "<div style='position:relative;'><img id='jscropper_source_image' src='"+the_img+"' />";
        the_html += "   <div id='jscropper_start_button'   onmousemove='jscropper.move(event)'  onmousedown='jscropper.start_moving(event,\"start\");'     onmouseup='jscropper.end_moving();'   style='position:absolute;width:100px; height:100px; margin:-50px 0 0 -50px; cursor:pointer; line-height:100px; text-align:center; background:rgba(255,0,0,0.05);color:red;      left:"+jscropper.start_coords.x+"px;    top:"+jscropper.start_coords.y+"px;     z-index:"+(the_z_index+1)+";'>&#10011;</div>";
        the_html += "   <div id='jscropper_end_button'     onmousemove='jscropper.move(event)'  onmousedown='jscropper.start_moving(event,\"end\");'       onmouseup='jscropper.end_moving();'   style='position:absolute;width:100px; height:100px; margin:-50px 0 0 -50px; cursor:pointer; line-height:100px; text-align:center; background:rgba(0,255,0,0.05);color:blue;     left:"+jscropper.end_coords.x+"px;      top:"+jscropper.end_coords.y+"px;       z-index:"+(the_z_index+2)+";'>&#10011;</div>";
        the_html += "</div>";
        the_html += "<div style='margin-top:20px; font-size:18px;'><a onclick='jscropper.ok()'>Ok</a> / <a onclick='jscropper.cancel()'>Cancel</a></div>";
        jscropper_interface.innerHTML = the_html;
    },
    
    // initiating moving on mousedown on a point
    start_moving:function(e,what){
        jscropper.move_target = what;
        jscropper.point_start_coords = jscropper[jscropper.move_target+"_coords"];
        jscropper.mouse_start_coords={
            x:e.clientX,
            y:e.clientY
        };
        jscropper.mouse_current_coords = jscropper.mouse_start_coords;
    },
    
    // release dragging 
    end_moving:function(){
        jscropper.move_target = "none";
    },
    
    // function called on mousemove
    move:function(e){
        if(jscropper.move_target != "none"){

            jscropper.mouse_current_coords={
                x:e.clientX,
                y:e.clientY
            };
            var diff={
                x : jscropper.mouse_current_coords.x - jscropper.mouse_start_coords.x,
                y : jscropper.mouse_current_coords.y - jscropper.mouse_start_coords.y
            };
            jscropper[jscropper.move_target+"_coords"]={
                x : jscropper.point_start_coords.x + diff.x,
                y : jscropper.point_start_coords.y + diff.y
            };
            jscropper.update();
        }
    },
    
    // function updating the position of points
    update:function(){
        document.getElementById("jscropper_"+jscropper.move_target+"_button").style.left = jscropper[jscropper.move_target+"_coords"].x;
        document.getElementById("jscropper_"+jscropper.move_target+"_button").style.top  = jscropper[jscropper.move_target+"_coords"].y;
    },
    
    // quick setting right bottom point on the right bottom corner of the image
    fit_end:function(){
        var jscropper_image = document.getElementById('jscropper_source_image');
        jscropper.move_target = "end";
        jscropper[jscropper.move_target+"_coords"] = {
            x: jscropper_image.clientWidth,
            y: jscropper_image.clientHeight
        }
        jscropper.update();
        jscropper.end_moving();
    },
    
    // when everything's done - click the function and you got your coordinates appended to destination object
    ok:function(){
        jscropper.destination.cut_coords = {
            cut:true,
            x:jscropper.start_coords.x,
            y:jscropper.start_coords.y,
            w:jscropper.end_coords.x-jscropper.start_coords.x,
            h:jscropper.end_coords.y-jscropper.start_coords.y
        }
        jscropper.exit();

    },
    
    // quitting the editor discarding all the changes (and forgetting them)
    exit:function(){
        var el = document.getElementById( 'jscropper_interface' );
        el.parentNode.removeChild( el ); 
    }
}