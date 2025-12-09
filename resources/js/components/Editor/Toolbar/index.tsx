import { Grid } from "@mui/material";
import pluginsList from "./toolbarIconsList";
import useOnClickListener from "./useOnClickListener";

const Toolbar = () => {
    const { onClick } = useOnClickListener();
    return (
        <Grid container justifyContent={"space-between"} py={1} px={1}  >
            {pluginsList.map((plugin)=>(
                <Grid item key={plugin.id}>
                    <plugin.Icon onClick={()=>onClick(plugin.event)}/>
                </Grid>
            ))}
        </Grid>
    );  
};

export default Toolbar;